const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

const getSalesDashboard = asyncHandler(async (req, res) => {
  const revenueMatch = { status: { $ne: 'cancelled' } };

  const [
    orderTotals,
    statusBreakdown,
    recentOrders,
    topSellingProducts
  ] = await Promise.all([
    Order.aggregate([
      { $match: revenueMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5),
    Order.aggregate([
      { $match: revenueMatch },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { quantitySold: -1, revenue: -1 } },
      { $limit: Number(req.query.topLimit) || 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          slug: '$product.slug',
          quantitySold: 1,
          revenue: 1
        }
      }
    ])
  ]);

  const totals = orderTotals[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0
  };

  res.json({
    success: true,
    message: 'Admin sales analytics fetched successfully',
    data: {
      stats: {
        totalRevenue: totals.totalRevenue || 0,
        totalOrders: totals.totalOrders || 0,
        averageOrderValue: Math.round(totals.averageOrderValue || 0)
      },
      statusBreakdown,
      topSellingProducts,
      recentOrders
    }
  });
});

module.exports = {
  getSalesDashboard
};
