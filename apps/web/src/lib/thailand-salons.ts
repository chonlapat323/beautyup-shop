import type { Region, Salon } from "./types";

export const REGION_SALON_COUNTS: Record<Region, number> = {
  BANGKOK_CENTRAL: 391,
  EAST: 24,
  WEST: 16,
  NORTH: 66,
  SOUTH: 89,
  NORTHEAST: 46,
};

export const THAILAND_SALON_DIRECTORY: Salon[] = [
  // -------------------------------------------------------------
  // กรุงเทพฯ และภาคกลาง (391)
  // -------------------------------------------------------------
  {
    name: "กรุงเทพมหานคร",
    province: "กรุงเทพมหานคร",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3/@13.6410915,100.5703653,11z/data=!4m2!2m1!6e1",
  },
  {
    name: "จังหวัดกำแพงเพชร",
    province: "กำแพงเพชร",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B3%E0%B9%81%E0%B8%9E%E0%B8%87%E0%B9%80%E0%B8%9E%E0%B8%8A%E0%B8%A3/@16.4696321,99.4907991,11.5z",
  },
  {
    name: "จังหวัดชัยนาท",
    province: "ชัยนาท",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%99%E0%B8%B2%E0%B8%97/@15.769639,99.9593621,8z",
  },
  {
    name: "จังหวัดนครนายก",
    province: "นครนายก",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%81%C2%A0/@13.9808922,100.688488,7z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดนครปฐม",
    province: "นครปฐม",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%9B%E0%B8%90%E0%B8%A1%C2%A0/@13.8508569,99.972124,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดนครสวรรค์",
    province: "นครสวรรค์",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%AA%E0%B8%A7%E0%B8%A3%E0%B8%A3%E0%B8%84%E0%B9%8C%C2%A0/@15.6916902,100.0946107,14z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดนนทบุรี",
    province: "นนทบุรี",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%C2%A0/@13.860693,100.4402334,13z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดปทุมธานี",
    province: "ปทุมธานี",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9B%E0%B8%97%E0%B8%B8%E0%B8%A1%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5%C2%A0/@13.9529031,100.5062886,10.75z",
  },
  {
    name: "จังหวัดพระนครศรีอยุธยา",
    province: "พระนครศรีอยุธยา",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AD%E0%B8%A2%E0%B8%B8%E0%B8%98%E0%B8%A2%E0%B8%B2%C2%A0/@13.9527898,100.506288,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดพิจิตร",
    province: "พิจิตร",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%B4%E0%B8%88%E0%B8%B4%E0%B8%95%E0%B8%A3%C2%A0/@13.7490466,100.7826058,8.5z",
  },
  {
    name: "จังหวัดพิษณุโลก",
    province: "พิษณุโลก",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%B4%E0%B8%A9%E0%B8%93%E0%B8%B8%E0%B9%82%E0%B8%A5%E0%B8%81%C2%A0/@13.7465149,100.782593,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดเพชรบูรณ์",
    province: "เพชรบูรณ์",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%9E%E0%B8%8A%E0%B8%A3%E0%B8%9A%E0%B8%B9%E0%B8%A3%E0%B8%93%E0%B9%8C%C2%A0/@15.4167929,100.0681972,8.25z",
  },
  {
    name: "จังหวัดลพบุรี",
    province: "ลพบุรี",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A5%E0%B8%9E%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%C2%A0/@14.9161264,100.5266169,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสมุทรปราการ",
    province: "สมุทรปราการ",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%A1%E0%B8%B8%E0%B8%97%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%C2%A0/@13.6256131,100.6208555,12z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสมุทรสงคราม",
    province: "สมุทรสงคราม",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%A1%E0%B8%B8%E0%B8%97%E0%B8%A3%E0%B8%AA%E0%B8%87%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%A1%C2%A0/@13.6255935,100.6208554,12z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสมุทรสาคร",
    province: "สมุทรสาคร",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%A1%E0%B8%B8%E0%B8%97%E0%B8%A3%E0%B8%AA%E0%B8%B2%E0%B8%84%E0%B8%A3%C2%A0/@13.6254268,100.4107071,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสิงห์บุรี",
    province: "สิงห์บุรี",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B9%8C%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%C2%A0/@14.8892033,100.387788,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสุโขทัย",
    province: "สุโขทัย",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B8%E0%B9%82%E0%B8%82%E0%B8%97%E0%B8%B1%E0%B8%A2/@14.411203,101.0603968,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสุพรรณบุรี",
    province: "สุพรรณบุรี",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B8%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%C2%A0/@14.4990611,99.9522425,12z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสระบุรี",
    province: "สระบุรี",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%C2%A0/@14.4804153,100.8089615,12z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดอ่างทอง",
    province: "อ่างทอง",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%97%E0%B8%AD%E0%B8%87%C2%A0/@14.4803117,100.808961,12z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดอุทัยธานี",
    province: "อุทัยธานี",
    region: "BANGKOK_CENTRAL",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B3%E0%B8%9C%E0%B8%A1+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A2%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5%C2%A0/@14.3052807,100.6009914,11.75z",
  },

  // -------------------------------------------------------------
  // ภาคตะวันออก (24)
  // -------------------------------------------------------------
  {
    name: "จังหวัดจันทบุรี",
    province: "จันทบุรี",
    region: "EAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5/@12.711113,101.5982699,7.25z",
  },
  {
    name: "จังหวัดฉะเชิงเทรา",
    province: "ฉะเชิงเทรา",
    region: "EAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%89%E0%B8%B0%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%A3%E0%B8%B2/@13.7375425,100.8729314,11z/data=!4m2!2m1!6e1",
  },
  {
    name: "จังหวัดชลบุรี",
    province: "ชลบุรี",
    region: "EAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%8A%E0%B8%A5%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5/@13.4636984,101.1523064,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดตราด",
    province: "ตราด",
    region: "EAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%94/@12.1496167,102.3964086,12z/data=!4m2!2m1!6e1",
  },
  {
    name: "จังหวัดปราจีนบุรี",
    province: "ปราจีนบุรี",
    region: "EAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%88%E0%B8%B5%E0%B8%99%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5/@12.1536357,101.3451333,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดระยอง",
    province: "ระยอง",
    region: "EAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B8%AD%E0%B8%87/@12.7450512,101.1954755,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสระแก้ว",
    province: "สระแก้ว",
    region: "EAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%A3%E0%B8%B0%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7/@13.3631898,102.1538775,9z/data=!3m1!4b1",
  },

  // -------------------------------------------------------------
  // ภาคตะวันตก (16)
  // -------------------------------------------------------------
  {
    name: "จังหวัดกาญจนบุรี",
    province: "กาญจนบุรี",
    region: "WEST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%8D%E0%B8%88%E0%B8%99%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5/@14.0737907,99.3774307,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดตาก",
    province: "ตาก",
    region: "WEST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%95%E0%B8%B2%E0%B8%81/@14.0746279,98.3962285,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดประจวบคีรีขันธ์",
    province: "ประจวบคีรีขันธ์",
    region: "WEST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E2%80%8B%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%A7%E0%B8%9A%E0%B8%84%E0%B8%B5%E0%B8%A3%E0%B8%B5%E0%B8%82%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C/@11.3843584,100.2762083,7.25z",
  },
  {
    name: "จังหวัดเพชรบุรี",
    province: "เพชรบุรี",
    region: "WEST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E2%80%8B%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%9E%E0%B8%8A%E0%B8%A3%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5/@11.4848817,101.6221438,7.5z",
  },
  {
    name: "จังหวัดราชบุรี",
    province: "ราชบุรี",
    region: "WEST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5/@13.5588791,99.5311805,8.25z",
  },

  // -------------------------------------------------------------
  // ภาคเหนือ (66)
  // -------------------------------------------------------------
  {
    name: "จังหวัดเชียงราย",
    province: "เชียงราย",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%A3%E0%B8%B2%E0%B8%A2%C2%A0/@13.5598361,99.5311645,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดเชียงใหม่",
    province: "เชียงใหม่",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88/@18.7529694,98.8112353,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดน่าน",
    province: "น่าน",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%99%C2%A0/@18.3492059,101.7704953,8z",
  },
  {
    name: "จังหวัดพะเยา",
    province: "พะเยา",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%B0%E0%B9%80%E0%B8%A2%E0%B8%B2/@19.1099588,99.8852215,8.5z",
  },
  {
    name: "จังหวัดแพร่",
    province: "แพร่",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%81%E0%B8%9E%E0%B8%A3%E0%B9%88%C2%A0/@18.1276768,100.289741,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดแม่ฮ่องสอน",
    province: "แม่ฮ่องสอน",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%AE%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B8%AD%E0%B8%99/@18.4189318,99.1635021,9z",
  },
  {
    name: "จังหวัดลำปาง",
    province: "ลำปาง",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A5%E0%B8%B3%E0%B8%9B%E0%B8%B2%E0%B8%87/@18.2558703,99.5493282,12z",
  },
  {
    name: "จังหวัดลำพูน",
    province: "ลำพูน",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A5%E0%B8%B3%E0%B8%9E%E0%B8%B9%E0%B8%99%C2%A0/@18.4819542,98.9922616,11z",
  },
  {
    name: "จังหวัดอุตรดิตถ์",
    province: "อุตรดิตถ์",
    region: "NORTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%95%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%E0%B8%96%E0%B9%8C/@17.4866719,100.2942016,10z",
  },

  // -------------------------------------------------------------
  // ภาคใต้ (89)
  // -------------------------------------------------------------
  {
    name: "จังหวัดกระบี่",
    province: "กระบี่",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B5%E0%B9%88/@7.9555824,98.4703036,9z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดชุมพร",
    province: "ชุมพร",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%8A%E0%B8%B8%E0%B8%A1%E0%B8%9E%E0%B8%A3/@10.4286833,99.1902421,9z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดตรัง",
    province: "ตรัง",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%95%E0%B8%A3%E0%B8%B1%E0%B8%87/@7.5501245,99.6164289,13z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดนครศรีธรรมราช",
    province: "นครศรีธรรมราช",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%A3%E0%B8%B2%E0%B8%8A/@8.348631,99.9735003,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดนราธิวาส",
    province: "นราธิวาส",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%A3%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%A7%E0%B8%B2%E0%B8%AA/@6.3160551,101.2794259,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดปัตตานี",
    province: "ปัตตานี",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9B%E0%B8%B1%E0%B8%95%E0%B8%95%E0%B8%B2%E0%B8%99%E0%B8%B5/@6.7938377,101.228501,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดพังงา",
    province: "พังงา",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%B1%E0%B8%87%E0%B8%87%E0%B8%B2/@8.5740824,98.4844068,9z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดพัทลุง",
    province: "พัทลุง",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/place/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B9%82%E0%B8%A1%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%94%E0%B9%8C+%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%9E%E0%B8%B1%E0%B8%97%E0%B8%A5%E0%B8%B8%E0%B8%87/@7.581325,99.471381,9.5z/data=!4m9!1m2!2m1!1z4LiL4Liy4Lil4Lit4LiZIG5lYXIg4LiI4Lix4LiH4Lir4Lin4Lix4LiU4Lie4Lix4LiX4Lil4Li44LiH!3m5!1s0x304d7d6f0369bee9:0xb5fac577b3bec9d5!8m2!3d7.6059237!4d100.0711056!15sCjzguIvguLLguKXguK3guJkgbmVhciDguIjguLHguIfguKvguKfguLHguJTguJ7guLHguJfguKXguLjguIeSAQpoYWlyX3NhbG9u4AEA",
  },
  {
    name: "จังหวัดภูเก็ต",
    province: "ภูเก็ต",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A0%E0%B8%B9%E0%B9%80%E0%B8%81%E0%B9%87%E0%B8%95/@7.9037509,98.2927684,12z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดระนอง",
    province: "ระนอง",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A3%E0%B8%B0%E0%B8%99%E0%B8%AD%E0%B8%87/@9.9172792,98.5093548,10z",
  },
  {
    name: "จังหวัดสตูล",
    province: "สตูล",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/place/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%AA%E0%B8%A7%E0%B8%A2%E0%B9%82%E0%B8%A1%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%94%E0%B9%8C+%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%B9%E0%B8%A5/@6.8714454,99.9850847,10z/data=!4m10!1m2!2m1!1z4LiL4Liy4Lil4Lit4LiZIG5lYXIg4LiI4Lix4LiH4Lir4Lin4Lix4LiU4Liq4LiV4Li54Lil!3m6!1s0x304c8d3b2b5c10fd:0x4d43384d38d788c9!8m2!3d6.6197669!4d100.0727434!15sCjbguIvguLLguKXguK3guJkgbmVhciDguIjguLHguIfguKvguKfguLHguJTguKrguJXguLnguKWSAQpoYWlyX3NhbG9u4AEA!16s%2Fg%2F11ghdj_m4_ ",
  },
  {
    name: "จังหวัดสงขลา",
    province: "สงขลา",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%87%E0%B8%82%E0%B8%A5%E0%B8%B2/@7.0799613,100.424535,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสุราษฎร์ธานี",
    province: "สุราษฎร์ธานี",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B8%E0%B8%A3%E0%B8%B2%E0%B8%A9%E0%B8%8E%E0%B8%A3%E0%B9%8C%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5/@9.0566597,99.3076917,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดยะลา",
    province: "ยะลา",
    region: "SOUTH",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A2%E0%B8%B0%E0%B8%A5%E0%B8%B2/@6.586362,101.2947481,12z/data=!3m1!4b1",
  },

  // -------------------------------------------------------------
  // ภาคอีสาน (46)
  // -------------------------------------------------------------
  {
    name: "จังหวัดกาฬสินธุ์",
    province: "กาฬสินธุ์",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%AC%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%98%E0%B8%B8%E0%B9%8C%C2%A0/@15.6334117,103.014751,8z",
  },
  {
    name: "จังหวัดขอนแก่น",
    province: "ขอนแก่น",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%82%E0%B8%AD%E0%B8%99%E0%B9%81%E0%B8%81%E0%B9%88%E0%B8%99%C2%A0/@16.4303044,102.8337838,12z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดชัยภูมิ",
    province: "ชัยภูมิ",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4%C2%A0/@15.7184051,102.6721429,7.75z",
  },
  {
    name: "จังหวัดนครพนม",
    province: "นครพนม",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%9E%E0%B8%99%E0%B8%A1%C2%A0/@16.3014037,104.7712043,7.25z",
  },
  {
    name: "จังหวัดนครราชสีมา",
    province: "นครราชสีมา",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%AA%E0%B8%B5%E0%B8%A1%E0%B8%B2%C2%A0/@14.7773139,101.9427011,9z",
  },
  {
    name: "จังหวัดบึงกาฬ",
    province: "บึงกาฬ",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9A%E0%B8%B6%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%AC%C2%A0/@17.724289,103.982237,8z",
  },
  {
    name: "จังหวัดบุรีรัมย์",
    province: "บุรีรัมย์",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9A%E0%B8%B8%E0%B8%A3%E0%B8%B5%E0%B8%A3%E0%B8%B1%E0%B8%A1%E0%B8%A2%E0%B9%8C%C2%A0/@14.5746424,102.6228463,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดมหาสารคาม",
    province: "มหาสารคาม",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B8%B2%E0%B8%A1%C2%A0/@15.8533538,103.4658234,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดมุกดาหาร",
    province: "มุกดาหาร",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A1%E0%B8%B8%E0%B8%81%E0%B8%94%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3%C2%A0/@16.462372,104.6973287,10.75z",
  },
  {
    name: "จังหวัดยโสธร",
    province: "ยโสธร",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A2%E0%B9%82%E0%B8%AA%E0%B8%98%E0%B8%A3%C2%A0/@15.4372727,104.4834778,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดร้อยเอ็ด",
    province: "ร้อยเอ็ด",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A2%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%94%C2%A0/@15.9826702,103.4999207,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดเลย",
    province: "เลย",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B9%80%E0%B8%A5%E0%B8%A2%C2%A0/@16.8877187,101.2918498,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดสกลนคร",
    province: "สกลนคร",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%81%E0%B8%A5%E0%B8%99%E0%B8%84%E0%B8%A3%C2%A0/@16.9081311,104.0140573,8.75z",
  },
  {
    name: "จังหวัดสุรินทร์",
    province: "สุรินทร์",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B8%E0%B8%A3%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C%C2%A0/@14.7615638,103.5711235,11z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดศรีสะเกษ",
    province: "ศรีสะเกษ",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B8%B0%E0%B9%80%E0%B8%81%E0%B8%A9%C2%A0/@15.0592056,103.7318797,8z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดหนองคาย",
    province: "หนองคาย",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AB%E0%B8%99%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B8%B2%E0%B8%A2%C2%A0/@17.719781,102.6499216,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดหนองบัวลำภู",
    province: "หนองบัวลำภู",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AB%E0%B8%99%E0%B8%AD%E0%B8%87%E0%B8%9A%E0%B8%B1%E0%B8%A7%E0%B8%A5%E0%B8%B3%E0%B8%A0%E0%B8%B9%C2%A0/@16.9002002,102.1779595,7.5z",
  },
  {
    name: "จังหวัดอุดรธานี",
    province: "อุดรธานี",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5%C2%A0/@17.33824,102.5447547,10z/data=!3m1!4b1",
  },
  {
    name: "จังหวัดอุบลราชธานี",
    province: "อุบลราชธานี",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%9A%E0%B8%A5%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5%C2%A0/@14.8997868,104.6839004,9.75z",
  },
  {
    name: "จังหวัดอำนาจเจริญ",
    province: "อำนาจเจริญ",
    region: "NORTHEAST",
    mapUrl: "https://www.google.com/maps/search/%E0%B8%8B%E0%B8%B2%E0%B8%A5%E0%B8%AD%E0%B8%99+near+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B3%E0%B8%99%E0%B8%B2%E0%B8%88%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D%C2%A0/@15.8913054,104.651439,11z/data=!3m1!4b1",
  },
];
