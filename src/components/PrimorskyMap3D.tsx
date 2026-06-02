import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Html, Sphere, Text } from "@react-three/drei"
import * as THREE from "three"
import Icon from "@/components/ui/icon"

interface Landmark {
  id: number
  name: string
  region: string
  position: [number, number, number]
  color: string
  history: string
  description: string
  founded: string
  category: string
}

const landmarks: Landmark[] = [
  {
    id: 1,
    name: "Владивосток",
    region: "Владивостокский городской округ",
    position: [0, 0.18, 0],
    color: "#3b82f6",
    history: "Основан в 1860 году как военный пост Российской империи на берегу Тихого океана.",
    description: "Главный город Приморского края и крупнейший порт России на Тихом океане. Здесь находится знаменитый мост на остров Русский и Владивостокская крепость.",
    founded: "1860",
    category: "Город",
  },
  {
    id: 2,
    name: "Уссурийск",
    region: "Уссурийский городской округ",
    position: [-0.35, 0.22, 0.15],
    color: "#10b981",
    history: "Основан в 1866 году как село Никольское, в 1898 году получил статус города.",
    description: "Второй по величине город края. Известен Уссурийским заповедником, где обитают уссурийские тигры и леопарды.",
    founded: "1866",
    category: "Город",
  },
  {
    id: 3,
    name: "Находка",
    region: "Находкинский городской округ",
    position: [0.4, 0.05, 0.2],
    color: "#f59e0b",
    history: "Бухта открыта в 1859 году экспедицией клипера 'Америка'. Город основан в 1950 году.",
    description: "Крупный торговый порт на берегу Японского моря. Центр рыбной промышленности и международной торговли Приморья.",
    founded: "1950",
    category: "Портовый город",
  },
  {
    id: 4,
    name: "Арсеньев",
    region: "Арсеньевский городской округ",
    position: [-0.1, 0.35, 0.3],
    color: "#8b5cf6",
    history: "Основан в 1902 году, назван в честь исследователя Дальнего Востока В.К. Арсеньева.",
    description: "Город в горной части Приморья. Здесь производят вертолёты «Ка» и развито авиастроение. Рядом — живописный хребет Сихотэ-Алинь.",
    founded: "1902",
    category: "Промышленный город",
  },
  {
    id: 5,
    name: "Хасанский район",
    region: "Хасанский муниципальный район",
    position: [-0.25, -0.15, 0.1],
    color: "#ef4444",
    history: "Место знаменитых боёв у озера Хасан в 1938 году — столкновения СССР и Японии.",
    description: "Самый южный район России, граничащий с Китаем и Северной Кореей. Здесь находится заповедник «Земля леопарда» и курорт Славянка.",
    founded: "1938",
    category: "Исторический район",
  },
  {
    id: 6,
    name: "Дальнегорск",
    region: "Дальнегорский городской округ",
    position: [0.5, 0.45, 0.1],
    color: "#06b6d4",
    history: "Основан в 1897 году как посёлок при свинцово-цинковом руднике.",
    description: "Горнодобывающий город на севере Приморья. Известен месторождениями бора, свинца и цинка, а также живописными сопками.",
    founded: "1897",
    category: "Горный город",
  },
  {
    id: 7,
    name: "Лазовский заповедник",
    region: "Лазовский район",
    position: [0.55, 0.2, 0.35],
    color: "#84cc16",
    history: "Создан в 1935 году для охраны амурского тигра и дальневосточного леопарда.",
    description: "Один из старейших заповедников Приморья. Площадь — 121 тысяча га. Здесь обитает около 50 тигров, сотни видов птиц и редкие растения.",
    founded: "1935",
    category: "Природный заповедник",
  },
  {
    id: 8,
    name: "Сихотэ-Алинский заповедник",
    region: "Тернейский район",
    position: [0.2, 0.6, 0.2],
    color: "#f97316",
    history: "Основан в 1935 году, включён в список Всемирного наследия ЮНЕСКО в 2001 году.",
    description: "Объект Всемирного наследия ЮНЕСКО. Один из крупнейших заповедников России — более 400 тысяч га нетронутой тайги и морского побережья.",
    founded: "1935",
    category: "Объект ЮНЕСКО",
  },
]

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <mesh ref={meshRef} receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color="#1a3a5c"
        roughness={0.8}
        metalness={0.1}
        wireframe={false}
      />
    </mesh>
  )
}

function LandmarkPin({
  landmark,
  onSelect,
  isSelected,
}: {
  landmark: Landmark
  onSelect: (l: Landmark | null) => void
  isSelected: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        hovered || isSelected ? 1.4 : 1.0
      )
    }
  })

  return (
    <group position={landmark.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(isSelected ? null : landmark)
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={landmark.color}
          emissive={landmark.color}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html
          center
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
          position={[0, 0.1, 0]}
        >
          <div className="px-2 py-1 bg-black/80 text-white text-xs rounded-full border border-white/20 backdrop-blur">
            {landmark.name}
          </div>
        </Html>
      )}
    </group>
  )
}

function Scene({
  onSelect,
  selected,
}: {
  onSelect: (l: Landmark | null) => void
  selected: Landmark | null
}) {
  const { gl } = useThree()
  gl.setClearColor(new THREE.Color("transparent"), 0)

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4488ff" />
      <Globe />
      {landmarks.map((lm) => (
        <LandmarkPin
          key={lm.id}
          landmark={lm}
          onSelect={onSelect}
          isSelected={selected?.id === lm.id}
        />
      ))}
      <OrbitControls
        enablePan={false}
        minDistance={1.8}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  )
}

export default function PrimorskyMap3D() {
  const [selected, setSelected] = useState<Landmark | null>(null)

  return (
    <section className="py-24 px-6 bg-[#080c10]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 ring-1 ring-white/15 rounded-full mb-6">
            <Icon name="Globe" size={16} />
            <span className="text-sm font-medium text-white/80">Интерактивная карта</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
            Районы Приморского края
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Вращай глобус, нажимай на точки — узнавай историю и описание каждого района
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* 3D Globe */}
          <div className="flex-1 relative min-h-[500px] lg:min-h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#050810] ring-1 ring-white/10">
            <Canvas
              camera={{ position: [0, 0, 2.8], fov: 50 }}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <Scene onSelect={setSelected} selected={selected} />
              </Suspense>
            </Canvas>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 rounded-full text-white/50 text-xs backdrop-blur">
              Перетащи для вращения · Колёсико для масштаба
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:w-96 flex flex-col gap-4">
            {selected ? (
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/15 p-6 flex flex-col gap-4 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2"
                      style={{ backgroundColor: selected.color + "33", color: selected.color }}
                    >
                      {selected.category}
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{selected.name}</h3>
                    <p className="text-white/50 text-sm mt-1">{selected.region}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                    <Icon name="BookOpen" size={12} />
                    <span>Описание</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{selected.description}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
                    <Icon name="History" size={12} />
                    <span>История</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{selected.history}</p>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl">
                  <Icon name="Calendar" size={14} className="text-white/40" />
                  <span className="text-white/50 text-xs">Основан:</span>
                  <span className="text-white text-sm font-medium">{selected.founded} г.</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col items-center justify-center gap-3 min-h-[200px] text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Icon name="MapPin" size={20} className="text-white/30" />
                </div>
                <p className="text-white/40 text-sm">Нажми на точку на глобусе, чтобы узнать об этом месте</p>
              </div>
            )}

            {/* Landmark list */}
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
              <p className="text-white/40 text-xs mb-3 px-1">Все локации</p>
              <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                {landmarks.map((lm) => (
                  <button
                    key={lm.id}
                    onClick={() => setSelected(selected?.id === lm.id ? null : lm)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      selected?.id === lm.id
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: lm.color }}
                    />
                    <span className="text-sm">{lm.name}</span>
                    <span className="ml-auto text-xs text-white/30">{lm.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
