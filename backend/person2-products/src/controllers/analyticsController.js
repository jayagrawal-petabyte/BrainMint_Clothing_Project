const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const getSalesDashboard = asyncHandler(async (req, res) => {
  const revenueMatch = { status: { $ne: 'cancelled' } };

  const [
    orderTotals,
    statusBreakdown,
    recentOrders,
    topSellingProducts,
    totalProducts,
    monthlyData
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
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: false } },
      {
        $project: {
          productId: '$_id',
          name: '$product.name',
          slug: '$product.slug',
          quantitySold: 1,
          revenue: 1
        }
      }
    ]),
    Product.countDocuments(),
    Order.aggregate([
      { $match: revenueMatch },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.month': 1 } }
    ])
  ]);

  const totals = orderTotals[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = monthlyData.map(item => ({
    name: monthNames[item._id.month - 1],
    revenue: item.revenue,
    orders: item.orders
  }));

  res.json({
    success: true,
    message: 'Admin sales analytics fetched successfully',
    data: {
      stats: {
        totalRevenue: totals.totalRevenue || 0,
        totalOrders: totals.totalOrders || 0,
        averageOrderValue: Math.round(totals.averageOrderValue || 0),
        totalProducts
      },
      chartData,
      statusBreakdown,
      topSellingProducts,
      recentOrders
    }
  });
});

// @desc    Get all orders (Admin Fallback)
// @route   GET /api/admin/analytics/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    message: 'Orders fetched successfully',
    data: orders
  });
});

module.exports = {
  getSalesDashboard,
  getAllOrders
};
