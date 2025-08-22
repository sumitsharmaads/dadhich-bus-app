import Image from "next/image";

export default function TestImagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Cloudinary Test</h2>
          <Image
            src="https://res.cloudinary.com/deefthtmd/image/upload/v1737892115/dadhich_bus/grleakppn2q2b4cpbagx.png"
            alt="Cloudinary Test Image"
            width={300}
            height={200}
            className="border rounded"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Unsplash Test</h2>
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d4c6f?w=300&h=200&fit=crop"
            alt="Unsplash Test Image"
            width={300}
            height={200}
            className="border rounded"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Placeholder Test</h2>
          <Image
            src="https://via.placeholder.com/300x200/0066cc/ffffff?text=Test+Image"
            alt="Placeholder Test Image"
            width={300}
            height={200}
            className="border rounded"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-100 rounded">
        <p className="text-green-800">
          ✅ If you can see all images above, your trusted image resources
          configuration is working correctly!
        </p>
      </div>
    </div>
  );
}
