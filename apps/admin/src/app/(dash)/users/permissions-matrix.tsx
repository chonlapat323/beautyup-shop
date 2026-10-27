"use client";

import clsx from "clsx";
import { Check, CheckCircle2, Info, Loader2, RotateCcw, Shield, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";
import {
  ADMIN_MODULES,
  DEFAULT_ROLE_PERMISSIONS,
  roleLabels,
  type AdminModuleKey,
  type PermissionAction,
  type Role,
  type RolePermissions,
} from "@beautyup/types";
import { saveRolePermissions } from "./actions";

const EDITABLE_ROLES: Role[] = ["MANAGER", "EDITOR", "STAFF"];

export function PermissionsMatrix({ initialPermissions }: { initialPermissions: RolePermissions }) {
  const [permissions, setPermissions] = useState<RolePermissions>(() => ({
    ...DEFAULT_ROLE_PERMISSIONS,
    ...initialPermissions,
  }));
  const [selectedRole, setSelectedRole] = useState<Role>("MANAGER");
  const [savedRole, setSavedRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const currentRolePerms = permissions[selectedRole] ?? DEFAULT_ROLE_PERMISSIONS[selectedRole] ?? {};

  const handleToggle = (
    moduleKey: AdminModuleKey,
    action: keyof PermissionAction,
    checked: boolean,
  ) => {
    setPermissions((prev) => {
      const roleData = { ...(prev[selectedRole] ?? DEFAULT_ROLE_PERMISSIONS[selectedRole] ?? {}) };
      const mod = { ...(roleData[moduleKey] ?? { view: false, create: false, update: false, delete: false }) };

      if (action === "view" && !checked) {
        // If view is disabled, all sub-actions are disabled
        mod.view = false;
        mod.create = false;
        mod.update = false;
        mod.delete = false;
      } else if (action !== "view" && checked) {
        // If create/update/delete is enabled, view must also be enabled
        mod.view = true;
        mod[action] = true;
      } else {
        mod[action] = checked;
      }

      return {
        ...prev,
        [selectedRole]: {
          ...roleData,
          [moduleKey]: mod,
        },
      };
    });
    setSavedRole(null);
  };

  const applyPreset = (preset: "all" | "readonly" | "none" | "default") => {
    setPermissions((prev) => {
      if (preset === "default") {
        return {
          ...prev,
          [selectedRole]: { ...DEFAULT_ROLE_PERMISSIONS[selectedRole] },
        };
      }

      const updated: Record<string, PermissionAction> = {};
      for (const m of ADMIN_MODULES) {
        if (preset === "all") {
          updated[m.key] = { view: true, create: true, update: true, delete: true };
        } else if (preset === "readonly") {
          updated[m.key] = { view: true, create: false, update: false, delete: false };
        } else {
          updated[m.key] = { view: false, create: false, update: false, delete: false };
        }
      }

      return {
        ...prev,
        [selectedRole]: updated,
      };
    });
    setSavedRole(null);
  };

  const handleSave = () => {
    setError(null);
    start(async () => {
      const res = await saveRolePermissions(permissions);
      if (res.ok) {
        setSavedRole(selectedRole);
      } else {
        setError(res.message || "บันทึกไม่สำเร็จ");
      }
    });
  };

  const isRoleAdmin = selectedRole === "ADMIN";

  return (
    <div className="space-y-6">
      {/* Role Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
        {(["ADMIN", ...EDITABLE_ROLES] as Role[]).map((r) => {
          const isSelected = selectedRole === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => {
                setSelectedRole(r);
                setSavedRole(null);
                setError(null);
              }}
              className={clsx(
                "inline-flex min-h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors",
                isSelected
                  ? "bg-ink text-white shadow-sm"
                  : "bg-white border border-line text-ink/80 hover:bg-sand hover:text-ink",
              )}
            >
              {r === "ADMIN" ? <ShieldCheck className="size-4" /> : <Shield className="size-4" />}
              <span>{roleLabels[r] || r}</span>
            </button>
          );
        })}
      </div>

      {/* Admin Notice */}
      {isRoleAdmin ? (
        <div className="card border-blue-200 bg-blue-50/60 p-6 flex items-start gap-3">
          <Info className="size-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold text-base mb-1">ผู้ดูแลระบบสูงสุด (ADMIN)</p>
            <p>
              บทบาท ADMIN มีสิทธิ์เต็มทุกด้านเสมอ (เห็นทุกเมนู, เพิ่ม, แก้ไข, ลบ และจัดการผู้ใช้)
              ไม่สามารถจำกัดสิทธิ์ได้ เพื่อรับประกันความปลอดภัยและการเข้าถึงระบบหลักเสมอ
            </p>
          </div>
        </div>
      ) : (
        <div className="card space-y-4 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-base font-semibold">
                กำหนดสิทธิ์สำหรับ: <span className="text-brand">{roleLabels[selectedRole] || selectedRole}</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">
                เลือกได้ว่าบทบาทนี้จะเห็นเมนูใด และสามารถทำอะไรได้บ้าง (Add, Edit, Read, Delete)
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted mr-1">ชุดคำสั่งด่วน:</span>
              <button
                type="button"
                onClick={() => applyPreset("all")}
                className="btn btn-secondary !min-h-8 !px-2.5 text-xs"
              >
                เปิดทุกสิทธิ์
              </button>
              <button
                type="button"
                onClick={() => applyPreset("readonly")}
                className="btn btn-secondary !min-h-8 !px-2.5 text-xs"
              >
                อ่านอย่างเดียว
              </button>
              <button
                type="button"
                onClick={() => applyPreset("none")}
                className="btn btn-secondary !min-h-8 !px-2.5 text-xs"
              >
                ปิดทั้งหมด
              </button>
              <button
                type="button"
                onClick={() => applyPreset("default")}
                title="คืนค่าสิทธิ์ตามมาตรฐานของระบบ"
                className="btn btn-secondary !min-h-8 !px-2.5 text-xs inline-flex items-center gap-1"
              >
                <RotateCcw className="size-3" /> ค่าเริ่มต้น
              </button>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold text-muted uppercase">
                  <th className="py-3 px-4">โมดูล / ส่วนงานในแอดมิน</th>
                  <th className="py-3 px-4 text-center">เห็นเมนู (Read)</th>
                  <th className="py-3 px-4 text-center">เพิ่ม (Add)</th>
                  <th className="py-3 px-4 text-center">แก้ไข (Edit)</th>
                  <th className="py-3 px-4 text-center">ลบ (Delete)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {ADMIN_MODULES.map((m) => {
                  const perm = currentRolePerms[m.key] ?? {
                    view: false,
                    create: false,
                    update: false,
                    delete: false,
                  };
                  return (
                    <tr key={m.key} className="hover:bg-sand/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-ink">{m.label}</p>
                        <p className="text-xs text-muted">{m.desc}</p>
                      </td>
                      {/* View */}
                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={perm.view}
                            onChange={(e) => handleToggle(m.key, "view", e.target.checked)}
                            className="size-4.5 rounded accent-brand"
                          />
                        </label>
                      </td>
                      {/* Add (Create) */}
                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={perm.create}
                            disabled={!perm.view}
                            onChange={(e) => handleToggle(m.key, "create", e.target.checked)}
                            className="size-4.5 rounded accent-brand disabled:opacity-30 disabled:cursor-not-allowed"
                          />
                        </label>
                      </td>
                      {/* Edit (Update) */}
                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={perm.update}
                            disabled={!perm.view}
                            onChange={(e) => handleToggle(m.key, "update", e.target.checked)}
                            className="size-4.5 rounded accent-brand disabled:opacity-30 disabled:cursor-not-allowed"
                          />
                        </label>
                      </td>
                      {/* Delete */}
                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex cursor-pointer items-center justify-center">
                          <input
                            type="checkbox"
                            checked={perm.delete}
                            disabled={!perm.view}
                            onChange={(e) => handleToggle(m.key, "delete", e.target.checked)}
                            className="size-4.5 rounded accent-brand disabled:opacity-30 disabled:cursor-not-allowed"
                          />
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Feedback & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
            <div className="flex-1">
              {savedRole === selectedRole && (
                <p className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium animate-fade-in">
                  <CheckCircle2 className="size-4" /> บันทึกการกำหนดสิทธิ์ของ {roleLabels[selectedRole]} แล้ว
                </p>
              )}
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            </div>

            <button
              type="button"
              disabled={pending}
              onClick={handleSave}
              className="btn btn-primary inline-flex items-center gap-2 min-w-36 justify-center"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> กำลังบันทึก...
                </>
              ) : (
                <>
                  <Check className="size-4" /> บันทึกการกำหนดสิทธิ์
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
