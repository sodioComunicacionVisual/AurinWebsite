import { Spotlight } from "./components/spotlight"
import { AnimatedSpotlight } from "./components/animated-spotlight"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SpotlightDemo() {
  return (
    <div className="min-h-screen bg-slate-900 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">スポットライトコンポーネント</h1>
          <p className="text-slate-300">マウスカーソルに追従するインタラクティブなスポットライト効果</p>
        </div>

        {/* カーソル追従スポットライト */}
        <Spotlight className="rounded-xl bg-slate-800 p-8" size={400} intensity={0.6} color="rgba(59, 130, 246, 0.2)">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">カーソル追従スポットライト</CardTitle>
              <CardDescription className="text-slate-300">
                マウスを動かしてスポットライト効果を確認してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-200">
                このカードの上でマウスを動かすと、カーソルに追従するスポットライト効果が表示されます。
                インタラクティブなUI要素を強調するのに最適です。
              </p>
              <div className="flex gap-2">
                <Button variant="secondary">ボタン 1</Button>
                <Button variant="outline">ボタン 2</Button>
                <Badge variant="secondary">バッジ</Badge>
              </div>
            </CardContent>
          </Card>
        </Spotlight>

        {/* アニメーションスポットライト */}
        <AnimatedSpotlight
          className="rounded-xl bg-slate-800 p-8"
          size={300}
          duration={3000}
          color="rgba(168, 85, 247, 0.15)"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">アニメーションスポットライト</CardTitle>
              <CardDescription className="text-slate-300">自動的に移動するスポットライト効果</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-200">
                このスポットライトは自動的に位置を変更し、コンテンツに動的な視覚効果を追加します。
                背景やヒーローセクションに最適です。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">機能 1</h3>
                  <p className="text-slate-300 text-sm">スポットライト効果でコンテンツを強調</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">機能 2</h3>
                  <p className="text-slate-300 text-sm">カスタマイズ可能なサイズと色</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSpotlight>

        {/* 複数のスポットライト */}
        <div className="grid md:grid-cols-2 gap-6">
          <Spotlight
            className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6"
            size={250}
            intensity={0.8}
            color="rgba(34, 197, 94, 0.2)"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white">グリーンスポットライト</h3>
              <p className="text-slate-300">緑色のスポットライト効果</p>
            </div>
          </Spotlight>

          <Spotlight
            className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6"
            size={250}
            intensity={0.8}
            color="rgba(239, 68, 68, 0.2)"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto flex items-center justify-center">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold text-white">レッドスポットライト</h3>
              <p className="text-slate-300">赤色のスポットライト効果</p>
            </div>
          </Spotlight>
        </div>

        {/* 使用例 */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">使用方法</CardTitle>
            <CardDescription className="text-slate-300">スポットライトコンポーネントの基本的な使用方法</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-lg">
              <code className="text-green-400 text-sm">
                {`<Spotlight size={300} intensity={0.8} color="rgba(59, 130, 246, 0.2)">`}
                <br />
                {`  <YourContent />`}
                <br />
                {`</Spotlight>`}
              </code>
            </div>
            <div className="text-slate-200 space-y-2">
              <p>
                <strong className="text-white">size:</strong> スポットライトのサイズ（ピクセル）
              </p>
              <p>
                <strong className="text-white">intensity:</strong> 効果の強度（0-1）
              </p>
              <p>
                <strong className="text-white">color:</strong> スポットライトの色（RGBA）
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
