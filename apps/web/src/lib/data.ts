// Data access layer. Pages only import from here, so swapping mock data
// for API calls (apps/api) later does not touch any page code.
import * as mock from "./mock-data";
import type { PostType } from "./types";

export const getMenu = async () => mock.menu;
export const getCompany = async () => mock.company;
export const getHeroSlides = async () => mock.heroSlides;
export const getVideos = async () => mock.videos;
export const getTimeline = async () => mock.timeline;
export const getPpStudioServices = async () => mock.ppStudioServices;
export const getProvinces = async () => mock.provinces;

export const getBrands = async (type?: "SALON" | "COUNTER") =>
  type ? mock.brands.filter((b) => b.type === type) : mock.brands;

export const getBrand = async (slug: string) =>
  mock.brands.find((b) => b.slug === slug);

export const getProducts = async (opts?: {
  brandSlug?: string;
  brandType?: "SALON" | "COUNTER";
}) => {
  const typeOf = new Map(mock.brands.map((b) => [b.slug, b.type]));
  return mock.products.filter(
    (p) =>
      (!opts?.brandSlug || p.brandSlug === opts.brandSlug) &&
      (!opts?.brandType || typeOf.get(p.brandSlug) === opts.brandType),
  );
};

export const getAmbassadors = async () => mock.ambassadors;

export const getSalons = async () => mock.salons;
export const getRegions = async () =>
  (Object.keys(mock.regionLabels) as (keyof typeof mock.regionLabels)[]).map(
    (key) => ({ key, label: mock.regionLabels[key], count: mock.regionCounts[key] }),
  );

export const getCourses = async () => mock.courses;
export const getCourse = async (slug: string) =>
  mock.courses.find((c) => c.slug === slug);

export const getPosts = async (type?: PostType) =>
  mock.posts
    .filter((p) => !type || p.type === type)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const getPost = async (slug: string) =>
  mock.posts.find((p) => p.slug === slug);

export const getTeam = async () => mock.team;
