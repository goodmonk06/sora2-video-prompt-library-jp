import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Phase 3 database seed...");

  // 既存データをクリア
  await prisma.favorite.deleteMany();
  await prisma.promptHistory.deleteMany();
  await prisma.promptPreset.deleteMany();
  await prisma.collection.deleteMany();
  console.log("✅ Cleared existing data");

  // コレクション作成
  console.log("📁 Creating collections...");

  const collections = await Promise.all([
    prisma.collection.create({
      data: {
        name: "未分類",
        description: "コレクションに属していないプロンプト",
        color: "#94a3b8",
        icon: "folder",
        isDefault: true,
      },
    }),
    prisma.collection.create({
      data: {
        name: "SF・未来都市",
        description: "SF作品、未来都市、テクノロジーをテーマにしたプロンプト",
        color: "#3b82f6",
        icon: "rocket",
      },
    }),
    prisma.collection.create({
      data: {
        name: "自然・風景",
        description: "自然、風景、季節をテーマにしたプロンプト",
        color: "#10b981",
        icon: "tree",
      },
    }),
    prisma.collection.create({
      data: {
        name: "都市・建築",
        description: "都市、建築、街並みをテーマにしたプロンプト",
        color: "#f59e0b",
        icon: "building",
      },
    }),
    prisma.collection.create({
      data: {
        name: "食べ物・料理",
        description: "料理、食べ物、レシピをテーマにしたプロンプト",
        color: "#ef4444",
        icon: "utensils",
      },
    }),
    prisma.collection.create({
      data: {
        name: "抽象・アート",
        description: "抽象的、芸術的な表現のプロンプト",
        color: "#8b5cf6",
        icon: "palette",
      },
    }),
  ]);

  console.log(`✅ Created ${collections.length} collections`);

  // プロンプト作成（50+サンプル）
  console.log("📝 Creating prompts...");

  const promptsData = [
    // SF・未来都市コレクション (10 prompts)
    {
      title: "未来都市の夕暮れ",
      description: "ネオンが輝く未来都市の夕暮れ時のシーン。ビルの間を縫うように飛ぶドローンと、反射する夕日の光が印象的。",
      mainPrompt: "A futuristic cityscape at sunset, neon lights reflecting off glass buildings, flying drones weaving between skyscrapers, golden hour lighting, cinematic wide shot",
      negativePrompt: "blurry, low quality, distorted, pixelated, overexposed",
      tags: JSON.stringify(["SF", "都市", "夕暮れ", "未来"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["cinematic", "wide shot", "golden hour", "aerial view"]),
      quality: 5,
      collectionId: collections[1].id,
    },
    {
      title: "サイバーパンク街道",
      description: "雨に濡れたネオン街のバイクチェイス。スピード感と緊張感が伝わるアクションシーン。",
      mainPrompt: "Cyberpunk motorcycle chase through rainy neon-lit streets, wet reflective surfaces, high-speed action, dramatic lighting, first-person perspective",
      negativePrompt: "static, slow, daytime, clean streets",
      tags: JSON.stringify(["SF", "サイバーパンク", "アクション", "バイク"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["fast-paced", "neon", "rain", "action"]),
      quality: 4,
      collectionId: collections[1].id,
    },
    {
      title: "宇宙ステーションからの地球",
      description: "国際宇宙ステーションの窓から見た地球の美しい姿。青い海と白い雲、大陸の輪郭が鮮明に見える。",
      mainPrompt: "View of Earth from International Space Station window, blue oceans and white clouds visible, continental outlines clear, stars in background, realistic space photography, 4K quality",
      negativePrompt: "cartoonish, fake, low resolution, distorted",
      tags: JSON.stringify(["宇宙", "地球", "科学", "リアル"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["realistic", "4K", "space photography", "slow pan"]),
      quality: 5,
      collectionId: collections[1].id,
    },
    {
      title: "ホログラムインターフェース操作",
      description: "未来的な半透明のホログラムUIを操作する様子。指の動きに反応するインタラクティブな表現が特徴。",
      mainPrompt: "Futuristic holographic interface being manipulated, transparent blue UI elements, hand gestures controlling data, sci-fi technology, interactive display, floating screens",
      negativePrompt: "physical screens, old technology, paper, static",
      tags: JSON.stringify(["SF", "ホログラム", "UI", "未来技術"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["holographic", "interactive", "sci-fi", "blue tones"]),
      quality: 5,
      collectionId: collections[1].id,
    },
    {
      title: "宇宙コロニーの内部",
      description: "回転する巨大な宇宙コロニーの内部構造。人工重力で生活する人々と緑豊かな環境が共存する未来の姿。",
      mainPrompt: "Interior of rotating space colony, artificial gravity, lush green gardens, futuristic architecture, people living in cylindrical habitat, sunlight streaming through windows, O'Neill cylinder design",
      negativePrompt: "dark, dystopian, damaged, claustrophobic",
      tags: JSON.stringify(["宇宙", "コロニー", "SF", "未来"]),
      lengthSeconds: 20,
      styleKeywords: JSON.stringify(["sci-fi", "architectural", "panoramic", "utopian"]),
      quality: 5,
      collectionId: collections[1].id,
    },
    {
      title: "AIロボット工場の生産ライン",
      description: "完全自動化されたロボット工場で製品が組み立てられる様子。機械の精密な動きと光のエフェクトが未来感を演出。",
      mainPrompt: "Fully automated robot factory assembly line, precise mechanical movements, robotic arms working in sync, LED lighting, high-tech production, industrial sci-fi aesthetic",
      negativePrompt: "manual labor, old machinery, rusty, slow",
      tags: JSON.stringify(["ロボット", "工場", "自動化", "SF"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["industrial", "mechanical", "precise", "high-tech"]),
      quality: 4,
      collectionId: collections[1].id,
    },
    {
      title: "量子コンピュータの内部イメージ",
      description: "量子ビットが複雑に絡み合う様子を視覚化した抽象的なSF映像。冷たい青白い光が神秘的な雰囲気を作る。",
      mainPrompt: "Quantum computer visualization, entangled qubits, complex particle interactions, cold blue-white lighting, abstract scientific representation, futuristic technology, microscopic view",
      negativePrompt: "simple, colorful, warm lighting, macroscopic",
      tags: JSON.stringify(["量子", "コンピュータ", "科学", "抽象"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["abstract", "scientific", "cold tones", "microscopic"]),
      quality: 4,
      collectionId: collections[1].id,
    },
    {
      title: "火星のテラフォーミング基地",
      description: "火星表面に建設された居住ドーム。赤い砂漠と青いドーム、地球化計画が進む未来の火星。",
      mainPrompt: "Mars terraforming base with biodomes on red desert landscape, Earth-like vegetation inside transparent domes, space colonization, futuristic architecture, red planet surface",
      negativePrompt: "Earth-like, green planet, no domes, primitive",
      tags: JSON.stringify(["火星", "宇宙", "コロニー", "SF"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["sci-fi", "colonization", "futuristic", "architectural"]),
      quality: 5,
      collectionId: collections[1].id,
    },
    {
      title: "ナノボットの顕微鏡映像",
      description: "血管内を移動する医療用ナノロボットの想像図。未来の医療技術を視覚化した科学的SF映像。",
      mainPrompt: "Medical nanobots moving through bloodstream, microscopic view, futuristic medical technology, red blood cells, scientific visualization, detailed mechanical design",
      negativePrompt: "macroscopic, low-tech, unclear, unrealistic",
      tags: JSON.stringify(["ナノテク", "医療", "科学", "SF"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["microscopic", "scientific", "medical", "detailed"]),
      quality: 4,
      collectionId: collections[1].id,
    },
    {
      title: "空飛ぶ車の交通網",
      description: "3次元的に張り巡らされた未来都市の交通システム。様々な高度を飛行する車両が織りなす立体的な交通の流れ。",
      mainPrompt: "Flying cars in 3D traffic network over futuristic city, multiple altitude layers, organized aerial traffic flow, sci-fi transportation, cityscape below, dynamic movement",
      negativePrompt: "ground traffic only, chaotic, crashed, old vehicles",
      tags: JSON.stringify(["空飛ぶ車", "未来", "交通", "都市"]),
      lengthSeconds: 18,
      styleKeywords: JSON.stringify(["aerial", "dynamic", "organized", "futuristic"]),
      quality: 5,
      collectionId: collections[1].id,
    },

    // 自然・風景コレクション (10 prompts)
    {
      title: "静かな森の朝",
      description: "朝霧に包まれた静かな森。木漏れ日が差し込み、小鳥のさえずりが聞こえてきそうな穏やかなシーン。",
      mainPrompt: "Peaceful forest scene in early morning, soft mist rolling through trees, sunbeams filtering through leaves, birds chirping, serene atmosphere, warm natural lighting",
      negativePrompt: "dark, gloomy, artificial, urban",
      tags: JSON.stringify(["自然", "森", "朝", "平和"]),
      lengthSeconds: 8,
      styleKeywords: JSON.stringify(["peaceful", "natural lighting", "slow motion", "wide angle"]),
      quality: 5,
      collectionId: collections[2].id,
    },
    {
      title: "サバンナの日の出",
      description: "アフリカのサバンナに昇る朝日。シルエットになった動物たちと地平線から昇る太陽が織りなす壮大な光景。",
      mainPrompt: "African savanna at sunrise, animals silhouetted against rising sun, vast open plains, golden light spreading across landscape, majestic and peaceful, wildlife documentary style",
      negativePrompt: "cloudy, dark, urban, artificial",
      tags: JSON.stringify(["アフリカ", "サバンナ", "日の出", "動物", "自然"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["documentary", "golden hour", "wide shot", "slow zoom"]),
      quality: 5,
      collectionId: collections[2].id,
    },
    {
      title: "波打ち際のスローモーション",
      description: "美しいビーチで砕ける波をスローモーションで捉えた映像。水しぶきと太陽の光が作り出す幻想的な雰囲気。",
      mainPrompt: "Ocean waves crashing on beach in slow motion, water droplets catching sunlight, crystal clear water, sandy beach, turquoise blue sea, high frame rate capture, dreamy atmosphere",
      negativePrompt: "fast motion, dark, stormy, polluted",
      tags: JSON.stringify(["海", "ビーチ", "波", "スローモーション"]),
      lengthSeconds: 8,
      styleKeywords: JSON.stringify(["slow motion", "high frame rate", "close-up", "dreamy"]),
      quality: 4,
      collectionId: collections[2].id,
    },
    {
      title: "桜吹雪の京都",
      description: "春の京都、満開の桜が風に舞い散る美しい光景。古都の風情と桜の儚さが調和した日本の春の象徴。",
      mainPrompt: "Cherry blossoms falling in Kyoto, pink petals swirling in wind, traditional Japanese temple in background, spring atmosphere, soft pastel colors, peaceful and elegant, cultural heritage",
      negativePrompt: "winter, autumn, modern buildings, harsh colors",
      tags: JSON.stringify(["京都", "桜", "春", "日本", "伝統"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["cultural", "soft colors", "slow motion", "elegant"]),
      quality: 5,
      collectionId: collections[2].id,
    },
    {
      title: "オーロラの夜空",
      description: "北極圏の夜空に現れる緑色のオーロラ。星空を背景に揺らめく光のカーテンが幻想的な世界を作り出す。",
      mainPrompt: "Northern lights aurora borealis dancing in night sky, vibrant green and purple colors, stars visible in background, snowy landscape below, magical and ethereal, time-lapse effect",
      negativePrompt: "daytime, clouds blocking view, dull colors, static",
      tags: JSON.stringify(["オーロラ", "夜空", "自然現象", "北極"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["time-lapse", "magical", "vibrant colors", "wide angle"]),
      quality: 5,
      collectionId: collections[2].id,
    },
    {
      title: "霧の高原の日の出",
      description: "霧に包まれた高原に朝日が差し込む神秘的な光景。草原の露が朝日に輝き、幻想的な雰囲気を醸し出す。",
      mainPrompt: "Misty highland at sunrise, morning dew glistening on grass, sun rays piercing through fog, ethereal atmosphere, wide landscape, golden hour lighting",
      negativePrompt: "urban, artificial, night, stormy",
      tags: JSON.stringify(["高原", "霧", "日の出", "自然"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["ethereal", "golden hour", "wide angle", "peaceful"]),
      quality: 5,
      collectionId: collections[2].id,
    },
    {
      title: "珊瑚礁の水中世界",
      description: "色とりどりの熱帯魚が泳ぐ美しい珊瑚礁。透明度の高い海中で繰り広げられる生命の営み。",
      mainPrompt: "Vibrant coral reef underwater, colorful tropical fish swimming, crystal clear water, marine biodiversity, natural lighting from surface, documentary style",
      negativePrompt: "murky water, dead coral, polluted, dark",
      tags: JSON.stringify(["海", "珊瑚礁", "熱帯魚", "水中"]),
      lengthSeconds: 18,
      styleKeywords: JSON.stringify(["underwater", "colorful", "documentary", "natural"]),
      quality: 5,
      collectionId: collections[2].id,
    },
    {
      title: "紅葉の渓谷",
      description: "秋の渓谷を彩る紅葉。赤、黄、橙の葉が織りなす色彩のグラデーションと清流の流れが美しい。",
      mainPrompt: "Autumn gorge with vibrant fall foliage, red yellow orange leaves, clear stream flowing through valley, aerial drone view, warm autumn colors, peaceful nature",
      negativePrompt: "summer, winter, urban, artificial colors",
      tags: JSON.stringify(["紅葉", "秋", "渓谷", "自然"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["autumn", "aerial", "colorful", "serene"]),
      quality: 5,
      collectionId: collections[2].id,
    },
    {
      title: "雷雨の草原",
      description: "遠くで雷が光る夜の草原。稲妻が闇を一瞬だけ照らし出すドラマチックな自然の力を表現。",
      mainPrompt: "Thunderstorm over prairie at night, lightning bolts illuminating sky, dramatic atmosphere, time-lapse clouds moving, powerful nature, wide landscape",
      negativePrompt: "calm, sunny, daytime, city",
      tags: JSON.stringify(["雷", "嵐", "草原", "夜"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["dramatic", "time-lapse", "powerful", "night"]),
      quality: 4,
      collectionId: collections[2].id,
    },
    {
      title: "竹林の風",
      description: "風に揺れる竹林の中を歩く視点。竹と竹が擦れる音が聞こえてきそうな静謐な日本の自然風景。",
      mainPrompt: "Walking through bamboo forest, tall bamboo swaying in wind, dappled sunlight, peaceful Japanese nature, first-person view, serene atmosphere",
      negativePrompt: "urban, loud, crowded, artificial",
      tags: JSON.stringify(["竹林", "日本", "自然", "静寂"]),
      lengthSeconds: 14,
      styleKeywords: JSON.stringify(["peaceful", "first-person", "Japanese", "natural"]),
      quality: 5,
      collectionId: collections[2].id,
    },

    // 都市・建築コレクション (10 prompts)
    {
      title: "雨の夜の東京",
      description: "雨に濡れた東京の夜景。ネオンサインが水たまりに反射し、傘をさした人々が行き交う賑やかな繁華街。",
      mainPrompt: "Rainy night in Tokyo, neon signs reflecting in puddles, people with umbrellas walking through busy streets, wet pavement, vibrant colors, cyberpunk aesthetic, dramatic lighting",
      negativePrompt: "dry, daytime, deserted, dull colors",
      tags: JSON.stringify(["東京", "夜", "雨", "都市", "ネオン"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["cyberpunk", "neon", "dramatic lighting", "tracking shot"]),
      quality: 5,
      collectionId: collections[3].id,
    },
    {
      title: "ドローンによる山岳地帯の空撮",
      description: "雄大な山々をドローンで空撮。雲海の上に浮かぶ山頂や、切り立った崖の迫力を鳥の視点から捉えた壮大な映像。",
      mainPrompt: "Aerial drone footage of mountain range, peaks rising above clouds, dramatic cliffs and valleys, epic landscape, bird's eye view, cinematic movement, breathtaking scenery",
      negativePrompt: "flat terrain, urban, low altitude, shaky footage",
      tags: JSON.stringify(["山", "空撮", "ドローン", "自然", "壮大"]),
      lengthSeconds: 20,
      styleKeywords: JSON.stringify(["aerial", "drone footage", "cinematic", "epic", "sweeping movement"]),
      quality: 5,
      collectionId: collections[3].id,
    },
    {
      title: "ニューヨークのタイムラプス",
      description: "マンハッタンの高層ビル群のタイムラプス。車のライトが光の軌跡を描き、都市の躍動感を表現。",
      mainPrompt: "Manhattan skyline time-lapse, skyscrapers at dusk, car light trails on streets, city lights turning on, urban energy, long exposure effect",
      negativePrompt: "daytime, static, rural, slow",
      tags: JSON.stringify(["ニューヨーク", "タイムラプス", "都市", "夜景"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["time-lapse", "urban", "dynamic", "long exposure"]),
      quality: 5,
      collectionId: collections[3].id,
    },
    {
      title: "モダン建築の幾何学美",
      description: "現代建築のシャープなラインと幾何学的な美しさ。ガラスと金属が織りなす都市の芸術作品。",
      mainPrompt: "Modern architecture geometric beauty, sharp clean lines, glass and metal surfaces, abstract architectural photography, minimalist design, symmetrical composition",
      negativePrompt: "old, weathered, organic shapes, chaotic",
      tags: JSON.stringify(["建築", "モダン", "幾何学", "デザイン"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["architectural", "geometric", "minimalist", "clean"]),
      quality: 4,
      collectionId: collections[3].id,
    },
    {
      title: "古都の石畳の路地",
      description: "ヨーロッパの古い街並みの石畳の路地。歴史を感じさせる建物と温かい街灯の光が旅情を誘う。",
      mainPrompt: "European old town cobblestone alley, historic stone buildings, warm street lamps, evening atmosphere, romantic and nostalgic, traditional architecture",
      negativePrompt: "modern, bright daylight, new buildings, busy",
      tags: JSON.stringify(["ヨーロッパ", "古都", "路地", "歴史"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["historic", "nostalgic", "warm lighting", "romantic"]),
      quality: 4,
      collectionId: collections[3].id,
    },
    {
      title: "超高層ビルの窓掃除",
      description: "超高層ビルの外壁で作業する窓掃除員の視点。眼下に広がる都市の景色と高所作業のスリル。",
      mainPrompt: "Window cleaner perspective on skyscraper exterior, city far below, vertiginous height, dramatic point of view, urban landscape, thrilling angle",
      negativePrompt: "ground level, safe, interior, low height",
      tags: JSON.stringify(["高層ビル", "都市", "高所", "スリル"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["point of view", "dramatic", "vertiginous", "urban"]),
      quality: 4,
      collectionId: collections[3].id,
    },
    {
      title: "工事現場のタイムラプス",
      description: "高層ビルが建設されていく過程を早回しで記録。都市の成長と人間の技術力を象徴する映像。",
      mainPrompt: "Construction site time-lapse, skyscraper being built from ground up, cranes moving, workers progressing, urban development, accelerated footage",
      negativePrompt: "completed building, static, abandoned, slow",
      tags: JSON.stringify(["建設", "タイムラプス", "都市開発", "工事"]),
      lengthSeconds: 20,
      styleKeywords: JSON.stringify(["time-lapse", "construction", "progressive", "development"]),
      quality: 4,
      collectionId: collections[3].id,
    },
    {
      title: "地下鉄ホームの人々",
      description: "忙しく行き交う人々を捉えた地下鉄ホームの風景。都市生活のリズムと多様性を表現。",
      mainPrompt: "Busy subway platform, commuters moving in different directions, urban rhythm, diverse crowd, motion blur, city life documentary style",
      negativePrompt: "empty, slow, rural, quiet",
      tags: JSON.stringify(["地下鉄", "都市", "通勤", "人々"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["documentary", "motion", "urban", "diverse"]),
      quality: 4,
      collectionId: collections[3].id,
    },
    {
      title: "ガラス張りビルの反射",
      description: "ガラス張りの高層ビルに映り込む青空と雲。建築と自然が融合した都市の抽象的な美しさ。",
      mainPrompt: "Glass skyscraper reflecting blue sky and clouds, architectural abstract beauty, geometric patterns, mirror effect, modern cityscape, clean aesthetic",
      negativePrompt: "dirty, old, night, no reflections",
      tags: JSON.stringify(["建築", "ガラス", "反射", "抽象"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["abstract", "reflective", "geometric", "clean"]),
      quality: 4,
      collectionId: collections[3].id,
    },
    {
      title: "橋の構造美",
      description: "吊り橋の複雑なケーブル構造を下から見上げた視点。工学的な美しさと力強さを表現。",
      mainPrompt: "Suspension bridge structure from below, complex cable network, engineering beauty, geometric patterns, powerful architecture, dramatic angle",
      negativePrompt: "simple, weak, distant view, unclear",
      tags: JSON.stringify(["橋", "構造", "工学", "建築"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["architectural", "geometric", "dramatic", "engineering"]),
      quality: 4,
      collectionId: collections[3].id,
    },

    // 食べ物・料理コレクション (10 prompts)
    {
      title: "料理の調理過程（マクロ撮影）",
      description: "フライパンで野菜を炒める様子をマクロレンズで撮影。油の跳ね方、野菜の色の変化を鮮明に捉えた食欲をそそる映像。",
      mainPrompt: "Macro shot of vegetables being stir-fried in wok, oil sizzling, colors changing, steam rising, extreme close-up, food photography, appetizing and vibrant, professional cooking",
      negativePrompt: "burnt, unappetizing, blurry, wide shot",
      tags: JSON.stringify(["料理", "食べ物", "マクロ", "調理"]),
      lengthSeconds: 6,
      styleKeywords: JSON.stringify(["macro", "close-up", "food photography", "vibrant"]),
      quality: 4,
      collectionId: collections[4].id,
    },
    {
      title: "チョコレートが溶けるスローモーション",
      description: "温かいケーキの上でチョコレートがゆっくりと溶けていく様子。光沢のある質感と流れる動きが美しいデザート映像。",
      mainPrompt: "Chocolate slowly melting on warm cake, glossy texture, flowing movement, extreme close-up slow motion, warm lighting, luxury dessert, food cinematography",
      negativePrompt: "fast motion, cold, hardened, matte texture",
      tags: JSON.stringify(["デザート", "チョコレート", "スローモーション", "食べ物"]),
      lengthSeconds: 8,
      styleKeywords: JSON.stringify(["slow motion", "macro", "luxury", "warm tones"]),
      quality: 5,
      collectionId: collections[4].id,
    },
    {
      title: "職人の寿司作り",
      description: "熟練の寿司職人が丁寧に握る様子。手の動き、米の質感、新鮮な魚の光沢を捉えた日本料理の芸術性を表現。",
      mainPrompt: "Master sushi chef preparing nigiri, skilled hands movement, fresh fish glistening, rice texture visible, traditional Japanese cuisine, professional craftsmanship, detailed close-up",
      negativePrompt: "amateur, messy, poor quality ingredients, rushed",
      tags: JSON.stringify(["寿司", "職人", "日本料理", "伝統"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["craftsmanship", "traditional", "close-up", "professional"]),
      quality: 5,
      collectionId: collections[4].id,
    },
    {
      title: "ピザ生地を伸ばす職人技",
      description: "イタリアンピッツァイオーロが生地を空中で回転させながら伸ばす伝統的な技。職人の技術と情熱が伝わる。",
      mainPrompt: "Italian pizzaiolo tossing pizza dough in air, skilled hand movements, traditional technique, flour dust in air, professional kitchen, authentic Italian cuisine",
      negativePrompt: "amateur, machine-made, frozen, careless",
      tags: JSON.stringify(["ピザ", "イタリア", "職人", "伝統"]),
      lengthSeconds: 8,
      styleKeywords: JSON.stringify(["craftsmanship", "traditional", "dynamic", "professional"]),
      quality: 4,
      collectionId: collections[4].id,
    },
    {
      title: "ラテアート制作",
      description: "バリスタが丁寧に作るラテアート。ミルクフォームで描かれる美しい模様が生まれる瞬間。",
      mainPrompt: "Barista creating latte art, milk foam forming beautiful pattern, espresso and milk combining, coffee shop atmosphere, skilled pouring technique, close-up",
      negativePrompt: "messy, spilled, plain coffee, rushed",
      tags: JSON.stringify(["コーヒー", "ラテアート", "バリスタ", "カフェ"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["close-up", "artistic", "skilled", "cafe"]),
      quality: 5,
      collectionId: collections[4].id,
    },
    {
      title: "鉄板焼きのパフォーマンス",
      description: "鉄板焼きレストランでシェフが華麗に食材を調理する様子。炎と包丁さばきのエンターテイメント性が高い映像。",
      mainPrompt: "Teppanyaki chef performance, flames rising from grill, skilled knife work, food flying and flipping, theatrical cooking, restaurant atmosphere, impressive technique",
      negativePrompt: "boring, simple cooking, no flames, amateur",
      tags: JSON.stringify(["鉄板焼き", "パフォーマンス", "料理", "エンターテイメント"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["theatrical", "dynamic", "skilled", "entertaining"]),
      quality: 5,
      collectionId: collections[4].id,
    },
    {
      title: "フルーツが水に落ちる瞬間",
      description: "新鮮なフルーツが水の中に落ちる瞬間をハイスピード撮影。水しぶきと気泡が織りなす美しい映像。",
      mainPrompt: "Fresh fruit dropping into water, high-speed photography, splash and bubbles, crystal clear water, vibrant fruit colors, frozen moment, refreshing visual",
      negativePrompt: "blurry, slow motion, dirty water, wilted fruit",
      tags: JSON.stringify(["フルーツ", "水", "ハイスピード", "新鮮"]),
      lengthSeconds: 6,
      styleKeywords: JSON.stringify(["high-speed", "splash", "vibrant", "refreshing"]),
      quality: 5,
      collectionId: collections[4].id,
    },
    {
      title: "パティシエのケーキデコレーション",
      description: "パティシエが繊細にケーキをデコレーションする様子。クリームの絞り方や飾り付けの芸術性が光る。",
      mainPrompt: "Pastry chef decorating luxury cake, precise piping technique, elegant frosting, delicate decorations, professional pastry work, artistic presentation",
      negativePrompt: "messy, simple, rushed, amateur",
      tags: JSON.stringify(["ケーキ", "デコレーション", "パティシエ", "芸術"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["precise", "elegant", "artistic", "professional"]),
      quality: 5,
      collectionId: collections[4].id,
    },
    {
      title: "ステーキの焼き加減",
      description: "高級レストランで完璧に焼き上げられるステーキ。肉汁と焼き色、シェフの技術が際立つ美食映像。",
      mainPrompt: "Premium steak being grilled to perfection, juices sizzling, beautiful char marks, chef's expertise, high-end restaurant, mouth-watering close-up",
      negativePrompt: "overcooked, burnt, low quality meat, amateur",
      tags: JSON.stringify(["ステーキ", "肉", "グリル", "高級"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["gourmet", "close-up", "premium", "appetizing"]),
      quality: 5,
      collectionId: collections[4].id,
    },
    {
      title: "手打ちパスタの製造",
      description: "伝統的な手法でパスタ生地を伸ばし、均一な細さに切り分ける職人の技。イタリア料理の伝統が息づく映像。",
      mainPrompt: "Handmade pasta being rolled and cut, traditional technique, uniform thickness, skilled craftsmanship, Italian culinary tradition, flour-dusted workspace",
      negativePrompt: "machine-made, uneven, rushed, modern factory",
      tags: JSON.stringify(["パスタ", "手打ち", "イタリア", "伝統"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["traditional", "craftsmanship", "authentic", "skilled"]),
      quality: 4,
      collectionId: collections[4].id,
    },

    // 抽象・アートコレクション (10 prompts)
    {
      title: "カラフルインクの水中拡散",
      description: "透明な水の中でカラフルなインクが広がる様子。有機的な形状と鮮やかな色彩が作り出す抽象アート。",
      mainPrompt: "Colorful ink dispersing in clear water, organic shapes forming, vibrant colors mixing, abstract art, slow motion, 4K macro, ethereal and mesmerizing",
      negativePrompt: "muddy colors, fast motion, low quality, chaotic",
      tags: JSON.stringify(["抽象", "インク", "水中", "アート"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["abstract", "slow motion", "colorful", "organic"]),
      quality: 5,
      collectionId: collections[5].id,
    },
    {
      title: "光の粒子が舞う空間",
      description: "暗闇の中で無数の光の粒子が舞い踊る幻想的な空間。音楽と連動するような有機的な動きが特徴。",
      mainPrompt: "Thousands of light particles dancing in dark space, organic movement, synchronized patterns, ethereal atmosphere, abstract visualization, cosmic feel",
      negativePrompt: "static, bright background, harsh lighting, geometric",
      tags: JSON.stringify(["光", "粒子", "抽象", "幻想的"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["particle", "ethereal", "dark atmosphere", "organic"]),
      quality: 4,
      collectionId: collections[5].id,
    },
    {
      title: "幾何学的モーフィング",
      description: "複雑な幾何学形状が次々と変形していくアニメーション。数学的美しさとダイナミックな動きが融合。",
      mainPrompt: "Complex geometric shapes morphing continuously, mathematical precision, dynamic transformation, clean lines, modern abstract art, seamless transitions",
      negativePrompt: "organic, natural, messy, random",
      tags: JSON.stringify(["幾何学", "モーフィング", "数学的", "抽象"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["geometric", "mathematical", "clean", "modern"]),
      quality: 4,
      collectionId: collections[5].id,
    },
    {
      title: "流体シミュレーション",
      description: "CGで制作された流体の動きのシミュレーション。複雑な流れと波紋が作り出す催眠的な映像。",
      mainPrompt: "Fluid simulation CGI, complex liquid movement, ripples and waves, hypnotic patterns, abstract digital art, smooth flowing motion, mesmerizing visual",
      negativePrompt: "static, solid, simple, jerky motion",
      tags: JSON.stringify(["流体", "シミュレーション", "CG", "抽象"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["CGI", "fluid", "hypnotic", "smooth"]),
      quality: 5,
      collectionId: collections[5].id,
    },
    {
      title: "万華鏡エフェクト",
      description: "万華鏡のように複雑に反射し変化していく幾何学パターン。視覚的なトリップ感のある抽象映像。",
      mainPrompt: "Kaleidoscope effect, complex geometric patterns mirroring and morphing, colorful symmetrical designs, psychedelic visual, mesmerizing transformation",
      negativePrompt: "simple, static, monochrome, asymmetric",
      tags: JSON.stringify(["万華鏡", "幾何学", "パターン", "抽象"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["kaleidoscopic", "symmetrical", "psychedelic", "geometric"]),
      quality: 4,
      collectionId: collections[5].id,
    },
    {
      title: "オーディオリアクティブビジュアル",
      description: "音楽に反応して動く抽象的なビジュアライゼーション。音の波形や周波数が視覚化される芸術作品。",
      mainPrompt: "Audio-reactive visualization, sound waves visualized, frequency spectrum animated, abstract music visualization, synchronized with audio, dynamic particles",
      negativePrompt: "static, silent, unresponsive, simple",
      tags: JSON.stringify(["音楽", "ビジュアライゼーション", "抽象", "反応"]),
      lengthSeconds: 18,
      styleKeywords: JSON.stringify(["audio-reactive", "dynamic", "abstract", "synchronized"]),
      quality: 5,
      collectionId: collections[5].id,
    },
    {
      title: "フラクタル構造のズーム",
      description: "無限に続くフラクタル図形を延々とズームしていく映像。数学的美しさと無限性を表現。",
      mainPrompt: "Infinite fractal zoom, Mandelbrot set exploration, mathematical beauty, endless patterns repeating, hypnotic journey, colorful abstract mathematics",
      negativePrompt: "finite, simple shapes, static, realistic",
      tags: JSON.stringify(["フラクタル", "数学", "無限", "抽象"]),
      lengthSeconds: 20,
      styleKeywords: JSON.stringify(["fractal", "infinite", "mathematical", "hypnotic"]),
      quality: 5,
      collectionId: collections[5].id,
    },
    {
      title: "ペイント爆発",
      description: "複数の色のペイントが空中で爆発し混ざり合う瞬間。カラフルで力強い抽象アート映像。",
      mainPrompt: "Paint explosion in mid-air, multiple colors bursting and mixing, high-speed capture, dynamic and energetic, abstract art, vibrant color splash",
      negativePrompt: "calm, monochrome, slow, neat",
      tags: JSON.stringify(["ペイント", "爆発", "色彩", "抽象"]),
      lengthSeconds: 8,
      styleKeywords: JSON.stringify(["explosive", "colorful", "high-speed", "dynamic"]),
      quality: 4,
      collectionId: collections[5].id,
    },
    {
      title: "煙のダンス",
      description: "暗い背景の中で優雅に立ち昇る白い煙。予測不可能な形状変化が作り出す自然の抽象芸術。",
      mainPrompt: "White smoke rising elegantly against dark background, unpredictable shape changes, natural abstract art, wispy patterns, mysterious atmosphere",
      negativePrompt: "colored smoke, fast motion, bright background, static",
      tags: JSON.stringify(["煙", "抽象", "自然", "優雅"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["elegant", "mysterious", "organic", "flowing"]),
      quality: 4,
      collectionId: collections[5].id,
    },
    {
      title: "クリスタルの光の屈折",
      description: "クリスタルを通過する光が作り出す虹色の屈折パターン。幾何学と自然が融合した美しい光学アート。",
      mainPrompt: "Light refracting through crystal, rainbow color patterns, geometric and natural beauty combined, optical art, prismatic effect, mesmerizing light play",
      negativePrompt: "dull, monochrome, no refraction, artificial",
      tags: JSON.stringify(["クリスタル", "光", "屈折", "虹色"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["optical", "prismatic", "colorful", "natural"]),
      quality: 5,
      collectionId: collections[5].id,
    },

    // 未分類コレクション (5 prompts)
    {
      title: "時計の文字盤クローズアップ",
      description: "アンティーク時計の文字盤と秒針が動く様子。時間の経過と機械の精密さを表現した映像。",
      mainPrompt: "Antique clock face close-up, second hand moving, vintage timepiece, mechanical precision, nostalgic atmosphere, detailed macro shot",
      negativePrompt: "digital, modern, blurry, broken",
      tags: JSON.stringify(["時計", "アンティーク", "時間", "機械"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["macro", "vintage", "mechanical", "nostalgic"]),
      quality: 4,
      collectionId: collections[0].id,
    },
    {
      title: "書道のストローク",
      description: "書道家が墨で力強く文字を書く瞬間。筆の動きと墨の濃淡が日本の伝統芸術を表現。",
      mainPrompt: "Calligraphy brush stroke, black ink on white paper, powerful movement, Japanese traditional art, close-up of brush tip, artistic expression",
      negativePrompt: "digital, printed, weak stroke, messy",
      tags: JSON.stringify(["書道", "墨", "日本", "伝統芸術"]),
      lengthSeconds: 6,
      styleKeywords: JSON.stringify(["traditional", "artistic", "close-up", "powerful"]),
      quality: 4,
      collectionId: collections[0].id,
    },
    {
      title: "風船が空に飛んでいく",
      description: "色とりどりの風船が青空に向かって飛んでいく平和で希望に満ちたシーン。自由と夢を象徴。",
      mainPrompt: "Colorful balloons floating up into blue sky, peaceful and hopeful scene, freedom and dreams symbolized, bright daylight, uplifting atmosphere",
      negativePrompt: "falling, dark sky, popped, gloomy",
      tags: JSON.stringify(["風船", "空", "希望", "自由"]),
      lengthSeconds: 12,
      styleKeywords: JSON.stringify(["uplifting", "bright", "symbolic", "peaceful"]),
      quality: 4,
      collectionId: collections[0].id,
    },
    {
      title: "図書館の静寂",
      description: "古い図書館の書棚と窓から差し込む光。静けさと知識の蓄積を感じさせる落ち着いた映像。",
      mainPrompt: "Old library interior, bookshelves filled with books, window light streaming in, peaceful silence, knowledge and wisdom atmosphere, vintage aesthetic",
      negativePrompt: "modern, noisy, empty, bright fluorescent",
      tags: JSON.stringify(["図書館", "本", "静寂", "知識"]),
      lengthSeconds: 15,
      styleKeywords: JSON.stringify(["peaceful", "vintage", "atmospheric", "interior"]),
      quality: 4,
      collectionId: collections[0].id,
    },
    {
      title: "ろうそくの炎",
      description: "暗闇の中で揺れるろうそくの炎。温かみのある光と影が作り出す瞑想的な雰囲気。",
      mainPrompt: "Candle flame flickering in darkness, warm glow, shadows dancing, meditative atmosphere, close-up, peaceful and contemplative mood",
      negativePrompt: "bright, electric light, windy, extinguished",
      tags: JSON.stringify(["ろうそく", "炎", "暗闇", "瞑想"]),
      lengthSeconds: 10,
      styleKeywords: JSON.stringify(["meditative", "warm", "close-up", "peaceful"]),
      quality: 4,
      collectionId: collections[0].id,
    },
  ];

  const prompts = [];
  for (const data of promptsData) {
    const prompt = await prisma.promptPreset.create({ data });
    prompts.push(prompt);

    // 履歴作成
    await prisma.promptHistory.create({
      data: {
        promptPresetId: prompt.id,
        snapshot: JSON.stringify(prompt),
        changeType: "created",
      },
    });
  }

  console.log(`✅ Created ${prompts.length} prompts with history`);

  // お気に入り作成
  console.log("⭐ Creating favorites...");
  const favorites = await Promise.all([
    prisma.favorite.create({
      data: {
        promptPresetId: prompts[0].id,  // 未来都市の夕暮れ
        userId: "default",
      },
    }),
    prisma.favorite.create({
      data: {
        promptPresetId: prompts[10].id,  // 静かな森の朝
        userId: "default",
      },
    }),
    prisma.favorite.create({
      data: {
        promptPresetId: prompts[20].id,  // 雨の夜の東京
        userId: "default",
      },
    }),
    prisma.favorite.create({
      data: {
        promptPresetId: prompts[31].id,  // 職人の寿司作り
        userId: "default",
      },
    }),
    prisma.favorite.create({
      data: {
        promptPresetId: prompts[40].id,  // カラフルインクの水中拡散
        userId: "default",
      },
    }),
  ]);

  console.log(`✅ Created ${favorites.length} favorites`);

  // 統計情報
  console.log("\n📊 Seed Summary:");
  console.log(`  Collections: ${collections.length}`);
  console.log(`  Prompts: ${prompts.length}`);
  console.log(`  Histories: ${prompts.length}`);
  console.log(`  Favorites: ${favorites.length}`);

  console.log("\n🎉 Phase 3 seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
