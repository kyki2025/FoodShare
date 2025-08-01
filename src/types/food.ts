/**
 * 美食分享应用的类型定义文件
 * 定义了美食记录等核心数据结构
 */

export interface FoodRecord {
  id: string;
  userId: string;
  date: string;
  restaurantName: string;
  dishes: Array<{
    name: string;
  }>;
  // 向后兼容旧的单菜品字段
  dishName?: string;
  cuisine: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  tasteRating: number;
  serviceRating: number;
  environmentRating: number;
  recommendationIndex: number;
  dishDescription: string;
  specialFeatures: string;
  diningEnvironment: string;
  serviceExperience: string;
  notes: string;
  imageUrls?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodRecordState {
  records: FoodRecord[];
  loading: boolean;
  addRecord: (record: Omit<FoodRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecord: (id: string, record: Partial<FoodRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  getRecordsByUser: (userId: string) => FoodRecord[];
  loadRecords: () => void;
}