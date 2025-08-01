/**
 * 美食记录卡片组件
 * 用于展示单个美食记录的信息
 */

import React, { useRef } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FoodRecord } from '../../types/food';
import { Edit, Trash2, MapPin, DollarSign, Star, Calendar, Download } from 'lucide-react';

interface FoodRecordCardProps {
  record: FoodRecord;
  onEdit: (record: FoodRecord) => void;
  onDelete: (id: string) => void;
}

const FoodRecordCard: React.FC<FoodRecordCardProps> = ({ record, onEdit, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  /**
   * 下载卡片截图
   */
  const downloadCardImage = async () => {
    if (!cardRef.current) return;
    
    try {
      // 动态导入html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const element = cardRef.current;
      
      // 创建一个临时的容器来克隆卡片
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '400px'; // 固定宽度
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '0';
      tempContainer.style.margin = '0';
      tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      // 克隆卡片内容
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // 移除操作按钮区域
      const buttonsContainer = clonedElement.querySelector('[data-exclude-from-screenshot="true"]');
      if (buttonsContainer) {
        buttonsContainer.remove();
      }
      
      // 移除所有可能导致问题的类和样式
      const removeProblematicClasses = (el: Element) => {
        if (el.classList) {
          el.classList.remove('hover:shadow-lg', 'transition-shadow', 'duration-200');
          // 移除所有截断相关的类
          const classesToRemove = ['line-clamp-1', 'line-clamp-2', 'line-clamp-3', 'truncate', 'overflow-hidden'];
          classesToRemove.forEach(cls => el.classList.remove(cls));
        }
        
        // 递归处理子元素
        Array.from(el.children).forEach(child => removeProblematicClasses(child));
      };
      
      removeProblematicClasses(clonedElement);
      
      // 设置克隆元素的样式
      clonedElement.style.width = '100%';
      clonedElement.style.height = 'auto';
      clonedElement.style.maxHeight = 'none';
      clonedElement.style.overflow = 'visible';
      clonedElement.style.position = 'relative';
      clonedElement.style.display = 'block';
      clonedElement.style.backgroundColor = '#ffffff';
      clonedElement.style.border = '1px solid #e5e7eb';
      clonedElement.style.borderRadius = '8px';
      clonedElement.style.boxShadow = 'none';
      
      // 确保所有文本都能完整显示
      const textElements = clonedElement.querySelectorAll('p, span, div');
      textElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.whiteSpace = 'pre-wrap';
        htmlEl.style.wordBreak = 'break-words';
        htmlEl.style.overflow = 'visible';
        htmlEl.style.textOverflow = 'unset';
        htmlEl.style.webkitLineClamp = 'unset';
        htmlEl.style.webkitBoxOrient = 'unset';
        htmlEl.style.display = htmlEl.style.display === '-webkit-box' ? 'block' : htmlEl.style.display;
      });
      
      // 处理图片
      const images = clonedElement.querySelectorAll('img');
      images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
      });
      
      // 特别处理底部日期和地址的对齐
      const dateAddressContainer = clonedElement.querySelector('.bottom-info-container');
      if (dateAddressContainer) {
        const htmlContainer = dateAddressContainer as HTMLElement;
        htmlContainer.style.cssText = `
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          width: 100% !important;
          padding-top: 12px !important;
          border-top: 1px solid #f3f4f6 !important;
        `;
        
        // 确保日期在左边
        const dateElement = htmlContainer.querySelector('.date-info');
        if (dateElement) {
          const htmlDateEl = dateElement as HTMLElement;
          htmlDateEl.style.cssText = `
            display: flex !important;
            align-items: center !important;
            flex: 0 0 auto !important;
            font-size: 12px !important;
            color: #6b7280 !important;
          `;
        }
        
        // 查找地址元素
        const addressElement = htmlContainer.querySelector('.address-info');
        if (addressElement) {
          const htmlAddressEl = addressElement as HTMLElement;
          htmlAddressEl.style.cssText = `
            text-align: right !important;
            flex: 1 1 auto !important;
            margin-left: 8px !important;
            overflow: visible !important;
            text-overflow: unset !important;
            white-space: nowrap !important;
            font-size: 12px !important;
            color: #6b7280 !important;
          `;
        }
      }
      
      // 处理所有flex布局元素
      const flexElements = clonedElement.querySelectorAll('.flex');
      flexElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.classList.contains('justify-between')) {
          htmlEl.style.display = 'flex';
          htmlEl.style.justifyContent = 'space-between';
          htmlEl.style.alignItems = 'center';
        } else if (htmlEl.classList.contains('items-center')) {
          htmlEl.style.display = 'flex';
          htmlEl.style.alignItems = 'center';
        }
      });
      
      // 处理grid布局
      const gridElements = clonedElement.querySelectorAll('.grid');
      gridElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.classList.contains('grid-cols-2')) {
          htmlEl.style.display = 'grid';
          htmlEl.style.gridTemplateColumns = '1fr 1fr';
          htmlEl.style.gap = '12px';
        }
      });
      
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);
      
      // 等待布局稳定和图片加载
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 获取实际尺寸
      const rect = clonedElement.getBoundingClientRect();
      const width = Math.max(400, rect.width);
      const height = Math.max(300, clonedElement.scrollHeight);
      
      console.log('截图尺寸:', { width, height });
      
      const canvas = await html2canvas(clonedElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true,
        width: width,
        height: height,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        removeContainer: false,
        onclone: (clonedDoc) => {
          // 在克隆的文档中进一步处理样式
          const clonedBody = clonedDoc.body;
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              -webkit-line-clamp: unset !important;
              -webkit-box-orient: unset !important;
              text-overflow: unset !important;
              overflow: visible !important;
              white-space: pre-wrap !important;
              word-break: break-words !important;
            }
            .line-clamp-1, .line-clamp-2, .line-clamp-3, .truncate {
              -webkit-line-clamp: unset !important;
              -webkit-box-orient: unset !important;
              text-overflow: unset !important;
              overflow: visible !important;
              display: block !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      // 清理临时容器
      document.body.removeChild(tempContainer);
      
      // 检查canvas是否有内容
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('生成的画布尺寸为0');
      }
      
      // 创建下载链接
      const link = document.createElement('a');
      const dishName = record.dishes && record.dishes.length > 0 ? record.dishes[0].name : record.dishName;
      link.download = `${record.restaurantName}-${dishName || '美食记录'}-${new Date().getTime()}.png`;
      
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      if (dataUrl === 'data:,') {
        throw new Error('生成的图片数据为空');
      }
      
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('卡片截图下载成功');
    } catch (error) {
      console.error('卡片截图下载失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      alert(`下载失败: ${errorMessage}，请重试`);
    }
  };

  /**
   * 渲染星级评分
   */
  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex items-center">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`${starSize} ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  /**
   * 格式化日期
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card ref={cardRef} className="hover:shadow-lg transition-shadow duration-200 border-orange-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-orange-700 mb-1">
              {record.restaurantName}
            </h3>
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-600">推荐菜品：</span>
              <div className="mt-1 space-y-1">
                {record.dishes && record.dishes.length > 0 ? (
                  record.dishes.map((dish, index) => (
                    <div key={index} className="text-gray-700">
                      <span className="font-medium">{dish.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-700">{record.dishName}</span>
                )}
              </div>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{record.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {record.cuisine}
              </Badge>
              {renderStars(record.rating)}
            </div>
          </div>
          <div className="flex space-x-2 ml-4" data-exclude-from-screenshot="true">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCardImage}
              className="text-orange-600 hover:text-orange-700 border-orange-200"
              title="下载美食记录卡片"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(record)}
              className="text-orange-600 hover:text-orange-700 border-orange-200"
              title="编辑记录"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(record.id)}
              className="text-red-600 hover:text-red-700 border-red-200"
              title="删除记录"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 美食图片 */}
        {record.imageUrls && record.imageUrls.length > 0 && (
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-600 block mb-2">美食图片：</span>
            <div className={`grid gap-2 ${record.imageUrls.length === 1 ? 'grid-cols-1' : record.imageUrls.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
              {record.imageUrls.filter(url => url.trim()).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${record.dishName} - 图片${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://sider.ai/autoimage/food';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 评分详情 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-sm">
            <span className="text-gray-600">口味：</span>
            {renderStars(record.tasteRating, 'sm')}
          </div>
          <div className="text-sm">
            <span className="text-gray-600">服务：</span>
            {renderStars(record.serviceRating, 'sm')}
          </div>
          <div className="text-sm">
            <span className="text-gray-600">环境：</span>
            {renderStars(record.environmentRating, 'sm')}
          </div>
          <div className="text-sm">
            <span className="text-gray-600">推荐：</span>
            {renderStars(record.recommendationIndex, 'sm')}
          </div>
        </div>

        {/* 人均消费 */}
        {record.price > 0 && (
          <div className="flex items-center mb-3">
            <span className="text-sm font-medium text-gray-600 mr-2">人均消费：</span>
            <span className="text-green-600 font-semibold">¥{record.price}</span>
          </div>
        )}

        {/* 菜品描述 */}
        {record.dishDescription && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-600 block mb-1">菜品描述：</span>
            <p className="text-sm text-gray-700 pl-2 border-l-2 border-orange-200 whitespace-pre-wrap break-words">
              {record.dishDescription}
            </p>
          </div>
        )}

        {/* 特色亮点 */}
        {record.specialFeatures && (
          <div className="mb-3">
            <span className="text-sm font-medium text-orange-600 block mb-1">特色亮点：</span>
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {record.specialFeatures}
            </p>
          </div>
        )}

        {/* 就餐环境 */}
        {record.diningEnvironment && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-600 block mb-1">就餐环境：</span>
            <p className="text-sm text-gray-700 pl-2 border-l-2 border-green-200 whitespace-pre-wrap break-words">
              {record.diningEnvironment}
            </p>
          </div>
        )}

        {/* 服务感受 */}
        {record.serviceExperience && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-600 block mb-1">服务感受：</span>
            <p className="text-sm text-gray-700 pl-2 border-l-2 border-blue-200 whitespace-pre-wrap break-words">
              {record.serviceExperience}
            </p>
          </div>
        )}

        {/* 标签 */}
        {record.tags && record.tags.length > 0 && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-600 block mb-1">标签：</span>
            <div className="flex flex-wrap gap-1">
              {record.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 用餐心得 */}
        {record.notes && (
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-600 block mb-1">用餐心得：</span>
            <p className="text-sm text-gray-600 italic pl-2 border-l-2 border-gray-200 whitespace-pre-wrap break-words">
              "{record.notes}"
            </p>
          </div>
        )}

        {/* 日期和地址信息 */}
        <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatDate(record.date)}</span>
            </div>
            {record.address && (
              <span className="text-right">{record.address}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodRecordCard;