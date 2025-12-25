import { NextRequest, NextResponse } from "next/server";
import { seoCache, cacheInvalidation } from "@/lib/seo/cache";

/**
 * GET /api/admin/seo/cache
 * Get cache statistics
 */
export async function GET() {
  try {
    const stats = seoCache.getStats();
    return NextResponse.json({
      success: true,
      data: stats,
      message: "Cache statistics retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get cache statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/seo/cache
 * Clear cache with optional pattern
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pattern = searchParams.get("pattern");
    const route = searchParams.get("route");
    const prefix = searchParams.get("prefix");

    if (route) {
      // Clear specific route
      cacheInvalidation.route(route);
    } else if (pattern) {
      // Clear routes matching pattern
      cacheInvalidation.pattern(pattern);
    } else if (prefix) {
      // Clear routes with prefix
      cacheInvalidation.prefix(prefix);
    } else {
      // Clear all cache
      cacheInvalidation.all();
    }

    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to clear cache",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
