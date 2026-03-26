import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import StarScene from '@/app/ui/dashboard/heart-scene';
import { lusitana } from '@/app/ui/fonts';

export default function Page() {
  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-pink-100 p-2 text-pink-600">
          <CubeTransparentIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className={`${lusitana.className} text-xl md:text-2xl`}>3D Star</h1>
          <p className="text-sm text-gray-500">
            一个带轨道控制器、支持全屏预览的 Three.js 五角星场景。
          </p>
        </div>
      </div>
      <StarScene />
    </main>
  );
}
