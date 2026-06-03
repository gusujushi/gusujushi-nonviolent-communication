// 模板：为一次高风险的当面冲突做准备（"该不该跟…摊牌""怎么开口"）。
// 并行建模三件事——我的需要 / 对方可能的需要 / 我在怕什么——再综合成一份谈话方案。
// 对应书里的"先倾听再表达"与愤怒四步：刺激≠起因，先看见双方需要。
//
// ⚠️ 这是模板，不是必须逐字运行的脚本。
// 只在真正高风险、用户明确想要系统准备时才改写成实际 Workflow 运行；
// 一般的情绪疏导或单句改写不要用它。改写时按场景增删，不要照搬。
//
// 期望 args：{ situation: "冲突是什么", other: "对方是谁/关系", goal: "我真正想要的结果" }

export const meta = {
  name: 'nvc-conflict-prep',
  description: '为高风险当面冲突做准备：并行建模双方需要与我的恐惧，综合成谈话方案与开场白',
  phases: [
    { title: 'Model', detail: '并行建模：我的需要 / 对方需要 / 我的恐惧' },
    { title: 'Plan', detail: '综合成开场白、要点、要倾听什么、雷区' },
  ],
}

const situation = (args && args.situation) || ''
const other = (args && args.other) || '对方'
const goal = (args && args.goal) || '未明确——准备阶段需先帮用户澄清'

const LENS_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    needs: { type: 'array', items: { type: 'string' }, description: '该视角下的核心需要' },
  },
  required: ['summary', 'needs'],
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    opening_line: { type: 'string', description: '第一句怎么开口——观察+感受+需要，不指责' },
    key_points: { type: 'array', items: { type: 'string' } },
    listen_for: { type: 'array', items: { type: 'string' }, description: '要在对方话里听出的需要信号' },
    landmines: { type: 'array', items: { type: 'string' }, description: '会让对方把你的话听成命令/指责的措辞' },
    request: { type: 'string', description: '可被真正拒绝的具体请求' },
  },
  required: ['opening_line', 'key_points', 'listen_for', 'request'],
}

const lenses = [
  { key: 'self', prompt: `站在用户角度，列出 ta 在这件事里真正未被满足的需要。情境：${situation}。目标：${goal}` },
  { key: 'other', prompt: `站在「${other}」角度，推测 ta 在这件事里可能的感受与需要。情境：${situation}。不要替 ta 辩护，只是理解。` },
  { key: 'fear', prompt: `帮用户说清：ta 迟迟不开口、最害怕的是什么？这恐惧底下是 ta 的什么需要？情境：${situation}` },
]

const modeled = (
  await parallel(
    lenses.map((l) => () =>
      agent(l.prompt, { label: `model:${l.key}`, phase: 'Model', schema: LENS_SCHEMA })
    )
  )
).filter(Boolean)

const plan = await agent(
  `基于以下三视角，给用户一份可用的谈话准备：开场白（观察+感受+需要，绝不指责）、几条要点、` +
    `要在对方话里倾听的需要信号、会被听成命令/指责的雷区措辞、一个能被真正拒绝的具体请求。\n` +
    `三视角：${JSON.stringify(modeled)}\n目标：${goal}`,
  { label: 'plan', phase: 'Plan', schema: PLAN_SCHEMA }
)

return { modeled, plan }
