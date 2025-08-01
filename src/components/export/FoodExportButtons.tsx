/**
 * 美食记录数据导出按钮组件
 * 支持导出HTML和Excel格式
 */

import React from 'react';
import { Button } from '../ui/button';
import { FoodRecord } from '../../types/food';
import { FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface FoodExportButtonsProps {
  records: FoodRecord[];
  username: string;
}

const FoodExportButtons: React.FC<FoodExportButtonsProps> = ({ records, username }) => {
  /**
   * 导出为HTML（可打印为PDF）
   */
  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${username} 的美食记录</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { color: #ea580c; font-size: 24px; font-weight: bold; }
        .subtitle { color: #666; margin-top: 10px; }
        .record { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
        .record-title { color: #ea580c; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .record-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px; }
        .info-item { display: flex; }
        .info-label { font-weight: bold; margin-right: 8px; min-width: 80px; }
        .rating { color: #f59e0b; }
        .description { margin-top: 15px; }
        .description-title { font-weight: bold; color: #374151; margin-bottom: 5px; }
        .description-content { color: #6b7280; line-height: 1.5; }
        .tags { margin-top: 10px; }
        .tag { display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 5px; }
        @media print {
            body { margin: 0; }
            .record { break-inside: avoid; page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${username} 的美食记录</div>
        <div class="subtitle">导出时间: ${new Date().toLocaleDateString('zh-CN')} | 总记录数: ${records.length} 条</div>
    </div>
    
    ${records.map((record, index) => `
        <div class="record">
            <div class="record-title">${index + 1}. ${record.restaurantName}</div>
            <div style="margin-bottom: 10px;">
                <span class="info-label">推荐菜品:</span>
                ${record.dishes && record.dishes.length > 0 
                  ? record.dishes.map(dish => `<span style="color: #ea580c; font-weight: bold;">${dish.name}</span>`).join(', ')
                  : record.dishName || '未记录'
                }
            </div>
            <div class="record-info">
                <div class="info-item">
                    <span class="info-label">用餐日期:</span>
                    <span>${new Date(record.date).toLocaleDateString('zh-CN')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">菜系:</span>
                    <span>${record.cuisine}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">地址:</span>
                    <span>${record.location}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">价格:</span>
                    <span>¥${record.price}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">综合评分:</span>
                    <span class="rating">${'★'.repeat(record.rating)}${'☆'.repeat(5 - record.rating)} (${record.rating}/5)</span>
                </div>
                <div class="info-item">
                    <span class="info-label">口味评分:</span>
                    <span class="rating">${'★'.repeat(record.tasteRating)}${'☆'.repeat(5 - record.tasteRating)} (${record.tasteRating}/5)</span>
                </div>
                <div class="info-item">
                    <span class="info-label">服务评分:</span>
                    <span class="rating">${'★'.repeat(record.serviceRating)}${'☆'.repeat(5 - record.serviceRating)} (${record.serviceRating}/5)</span>
                </div>
                <div class="info-item">
                    <span class="info-label">环境评分:</span>
                    <span class="rating">${'★'.repeat(record.environmentRating)}${'☆'.repeat(5 - record.environmentRating)} (${record.environmentRating}/5)</span>
                </div>
                <div class="info-item">
                    <span class="info-label">推荐指数:</span>
                    <span class="rating">${'★'.repeat(record.recommendationIndex)}${'☆'.repeat(5 - record.recommendationIndex)} (${record.recommendationIndex}/5)</span>
                </div>
            </div>
            
            ${record.dishDescription ? `
                <div class="description">
                    <div class="description-title">菜品描述:</div>
                    <div class="description-content">${record.dishDescription}</div>
                </div>
            ` : ''}
            
            ${record.specialFeatures ? `
                <div class="description">
                    <div class="description-title">特色亮点:</div>
                    <div class="description-content">${record.specialFeatures}</div>
                </div>
            ` : ''}
            
            ${record.diningEnvironment ? `
                <div class="description">
                    <div class="description-title">就餐环境:</div>
                    <div class="description-content">${record.diningEnvironment}</div>
                </div>
            ` : ''}
            
            ${record.serviceExperience ? `
                <div class="description">
                    <div class="description-title">服务感受:</div>
                    <div class="description-content">${record.serviceExperience}</div>
                </div>
            ` : ''}
            
            ${record.notes ? `
                <div class="description">
                    <div class="description-title">用餐心得:</div>
                    <div class="description-content">${record.notes}</div>
                </div>
            ` : ''}
            
            ${record.tags && record.tags.length > 0 ? `
                <div class="tags">
                    <div class="description-title">标签:</div>
                    ${record.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            ${record.imageUrls && record.imageUrls.filter(url => url.trim()).length > 0 ? `
                <div class="description">
                    <div class="description-title">美食图片:</div>
                    <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                        ${record.imageUrls.filter(url => url.trim()).map((url, imgIndex) => 
                            `<img src="${url}" alt="美食图片${imgIndex + 1}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 4px; border: 1px solid #e5e7eb;" />`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('')}
    
    <script>
        // 自动打印对话框（可选）
        // window.onload = function() { window.print(); }
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}-food-records-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * 截断文本以适应Excel单元格限制
   */
  const truncateText = (text: string | undefined, maxLength: number = 32000): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...(内容已截断)';
  };

  /**
   * 导出为Excel
   */
  const exportToExcel = () => {
    const worksheetData = records.map(record => ({
      '用餐日期': new Date(record.date).toLocaleDateString('zh-CN'),
      '店铺名称': truncateText(record.restaurantName, 100),
      '推荐菜品': truncateText(
        record.dishes && record.dishes.length > 0 
          ? record.dishes.map(dish => dish.name).join(', ')
          : record.dishName || '未记录', 
        200
      ),
      '菜系': truncateText(record.cuisine, 50),
      '地址': truncateText(record.location, 200),
      '详细地址': truncateText(record.address || '', 200),
      '人均消费': record.price,
      '综合评分': record.rating,
      '口味评分': record.tasteRating,
      '服务评分': record.serviceRating,
      '环境评分': record.environmentRating,
      '推荐指数': record.recommendationIndex,
      '菜品描述': truncateText(record.dishDescription, 1000),
      '特色亮点': truncateText(record.specialFeatures, 1000),
      '就餐环境': truncateText(record.diningEnvironment, 1000),
      '服务感受': truncateText(record.serviceExperience, 1000),
      '用餐心得': truncateText(record.notes, 5000),
      '标签': record.tags ? record.tags.join(', ') : '',
      '图片数量': record.imageUrls ? record.imageUrls.filter(url => url.trim()).length : 0,
      '创建时间': new Date(record.createdAt).toLocaleString('zh-CN')
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    
    // 设置列宽
    const colWidths = [
      { wch: 12 }, // 用餐日期
      { wch: 20 }, // 店铺名称
      { wch: 25 }, // 推荐菜品
      { wch: 10 }, // 菜系
      { wch: 20 }, // 地址
      { wch: 25 }, // 详细地址
      { wch: 10 }, // 人均消费
      { wch: 8 },  // 综合评分
      { wch: 8 },  // 口味评分
      { wch: 8 },  // 服务评分
      { wch: 8 },  // 环境评分
      { wch: 8 },  // 推荐指数
      { wch: 30 }, // 菜品描述
      { wch: 30 }, // 特色亮点
      { wch: 30 }, // 就餐环境
      { wch: 30 }, // 服务感受
      { wch: 50 }, // 用餐心得
      { wch: 20 }, // 标签
      { wch: 10 }, // 图片数量
      { wch: 18 }  // 创建时间
    ];
    worksheet['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, '美食记录');
    XLSX.writeFile(workbook, `${username}-food-records-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (records.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={exportToHTML}
        className="flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        导出HTML
      </Button>
      <Button
        variant="outline"
        onClick={exportToExcel}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="w-4 h-4" />
        导出Excel
      </Button>
    </div>
  );
};

export default FoodExportButtons;