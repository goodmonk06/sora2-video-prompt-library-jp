import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 既存データをクリア
  await prisma.promptPreset.deleteMany();
  console.log("✅ Cleared existing data");

  // サンプルプロンプトデータ
  const samplePrompts = [
    {
      title: "未来都市の夕暮れ",
      description: "ネオンが輝く未来都市の夕暮れ時のシーン。ビルの間を縫うように飛ぶドローンと、反射する夕日の光が印象的。",
      mainPrompt: "A futuristic cityscape at sunset, neon lights reflecting off glass buildings, flying drones weaving between skyscrapers, golden hour lighting, cinematic wide shot",
      negativePrompt: "blurry, low quality, distorted, pixelated, overexposed",
      tags: JSON.stringify(["SF", "都市", "夕暮れ", "未来"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["cinematic", "wide shot", "golden hour", "aerial view"]),
    },
    {
      title: "静かな森の朝",
      description: "朝霧に包まれた静かな森。木漏れ日が差し込み、小鳥のさえずりが聞こえてきそうな穏やかなシーン。",
      mainPrompt: "Peaceful forest scene in early morning, soft mist rolling through trees, sunbeams filtering through leaves, birds chirping, serene atmosphere, warm natural lighting",
      negativePrompt: "dark, gloomy, artificial, urban",
      tags: JSON.stringify(["自然", "森", "朝", "平和"]),
      lengthSeconds: 8,
      styleKeywords: JSON.stringify(["peaceful", "natural lighting", "slow motion", "wide angle"]),
    },
    {
      title: "宇宙ステーションからの地球",
      description: "国際宇宙ステーションの窓から見た地球の美しい姿。青い海と白い雲、大陸の輪郭が鮮明に見える。",
      mainPrompt: "View of Earth from International Space Station window, blue oceans and white clouds visible, continental outlines clear, stars in background, realistic space photography, 4K quality",
      negativePrompt: "cartoonish, fake, low resolution, distorted",
      tags: JSON.stringify(["宇宙", "地球", "科学", "リアル"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["realistic", "4K", "space photography", "slow pan"]),
    },
    {
      title: "雨の夜の東京",
      description: "雨に濡れた東京の夜景。ネオンサインが水たまりに反射し、傘をさした人々が行き交う賑やかな繁華街。",
      mainPrompt: "Rainy night in Tokyo, neon signs reflecting in puddles, people with umbrellas walking through busy streets, wet pavement, vibrant colors, cyberpunk aesthetic, dramatic lighting",
      negativePrompt: "dry, daytime, deserted, dull colors",
      tags: JSON.stringify(["東京", "夜", "雨", "都市", "ネオン"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["cyberpunk", "neon", "dramatic lighting", "tracking shot"]),
    },
    {
      title: "サバンナの日の出",
      description: "アフリカのサバンナに昇る朝日。シルエットになった動物たちと地平線から昇る太陽が織りなす壮大な光景。",
      mainPrompt: "African savanna at sunrise, animals silhouetted against rising sun, vast open plains, golden light spreading across landscape, majestic and peaceful, wildlife documentary style",
      negativePrompt: "cloudy, dark, urban, artificial",
      tags: JSON.stringify(["アフリカ", "サバンナ", "日の出", "動物", "自然"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["documentary", "golden hour", "wide shot", "slow zoom"]),
    },
    {
      title: "波打ち際のスローモーション",
      description: "美しいビーチで砕ける波をスローモーションで捉えた映像。水しぶきと太陽の光が作り出す幻想的な雰囲気。",
      mainPrompt: "Ocean waves crashing on beach in slow motion, water droplets catching sunlight, crystal clear water, sandy beach, turquoise blue sea, high frame rate capture, dreamy atmosphere",
      negativePrompt: "fast motion, dark, stormy, polluted",
      tags: JSON.stringify(["海", "ビーチ", "波", "スローモーション"]),
      lengthSeconds: 8,
      styleKeywords: JSON.stringify(["slow motion", "high frame rate", "close-up", "dreamy"]),
    },
    {
      title: "桜吹雪の京都",
      description: "春の京都、満開の桜が風に舞い散る美しい光景。古都の風情と桜の儚さが調和した日本の春の象徴。",
      mainPrompt: "Cherry blossoms falling in Kyoto, pink petals swirling in wind, traditional Japanese temple in background, spring atmosphere, soft pastel colors, peaceful and elegant, cultural heritage",
      negativePrompt: "winter, autumn, modern buildings, harsh colors",
      tags: JSON.stringify(["京都", "桜", "春", "日本", "伝統"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["cultural", "soft colors", "slow motion", "elegant"]),
    },
    {
      title: "オーロラの夜空",
      description: "北極圏の夜空に現れる緑色のオーロラ。星空を背景に揺らめく光のカーテンが幻想的な世界を作り出す。",
      mainPrompt: "Northern lights aurora borealis dancing in night sky, vibrant green and purple colors, stars visible in background, snowy landscape below, magical and ethereal, time-lapse effect",
      negativePrompt: "daytime, clouds blocking view, dull colors, static",
      tags: JSON.stringify(["オーロラ", "夜空", "自然現象", "北極"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["time-lapse", "magical", "vibrant colors", "wide angle"]),
    },
    {
      title: "料理の調理過程（マクロ撮影）",
      description: "フライパンで野菜を炒める様子をマクロレンズで撮影。油の跳ね方、野菜の色の変化を鮮明に捉えた食欲をそそる映像。",
      mainPrompt: "Macro shot of vegetables being stir-fried in wok, oil sizzling, colors changing, steam rising, extreme close-up, food photography, appetizing and vibrant, professional cooking",
      negativePrompt: "burnt, unappetizing, blurry, wide shot",
      tags: JSON.stringify(["料理", "食べ物", "マクロ", "調理"]),
      lengthSeconds: 6,
      styleKeywords: JSON.stringify(["macro", "close-up", "food photography", "vibrant"]),
    },
    {
      title: "ドローンによる山岳地帯の空撮",
      description: "雄大な山々をドローンで空撮。雲海の上に浮かぶ山頂や、切り立った崖の迫力を鳥の視点から捉えた壮大な映像。",
      mainPrompt: "Aerial drone footage of mountain range, peaks rising above clouds, dramatic cliffs and valleys, epic landscape, bird's eye view, cinematic movement, breathtaking scenery",
      negativePrompt: "flat terrain, urban, low altitude, shaky footage",
      tags: JSON.stringify(["山", "空撮", "ドローン", "自然", "壮大"]),
      lengthSeconds: 20,
      styleKeywords: JSON.stringify(["aerial", "drone footage", "cinematic", "epic", "sweeping movement"]),
    },
  ];

  // データ投入
  for (const prompt of samplePrompts) {
    await prisma.promptPreset.create({
      data: prompt,
    });
    console.log(`✅ Created: ${prompt.title}`);
  }

  console.log("🎉 Seed completed successfully!");
  console.log(`📊 Created ${samplePrompts.length} sample prompts`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
