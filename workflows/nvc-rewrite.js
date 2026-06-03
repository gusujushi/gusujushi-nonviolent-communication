// 模板：把一段指责性/情绪化的话重写为「观察+感受+需要+请求」，
// 并做对抗式自检——确认改完不是"换了皮的指责"或"伪装成请求的命令"。
//
// ⚠️ 这是模板，不是必须逐字运行的脚本。
// 日常的"帮我改这句话"直接内联回答即可，别召 agent。
// 只有当这句话事关重大、且用户想要更稳的版本时，才把它改写成实际的 Workflow 运行；
// 改写时按需增删阶段，不要照搬。
//
// 期望 args：{ raw: "用户原话", context: "对谁说 / 关系 / 想要的结果" }

export const meta = {
  name: 'nvc-rewrite',
  description: '把指责性的话重写为观察+感受+需要+请求，并对抗式检验是否仍像指责或命令',
  phases: [
    { title: 'Diagnose', detail: '扫出异化沟通四反模式，抽出观察/感受/需要' },
    { title: 'Draft', detail: '生成 2 个口气不同的非暴力版本 + 一个具体请求' },
    { title: 'Verify', detail: '对抗式检查：是否仍像指责/像命令/像伪共情' },
  ],
}

const raw = (args && args.raw) || ''
const context = (args && args.context) || '未提供背景'

const DIAG_SCHEMA = {
  type: 'object',
  properties: {
    antipatterns: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['道德评判', '比较', '回避责任', '强人所难'] },
          span: { type: 'string', description: '原话里命中的片段' },
          why: { type: 'string' },
        },
        required: ['type', 'span'],
      },
    },
    observation: { type: 'string', description: '只描述具体时空里的行为，不带评判' },
    feeling: { type: 'string', description: '具体情绪词，不是"我觉得你…"' },
    need: { type: 'string', description: '说话人自身未被满足的需要' },
  },
  required: ['observation', 'feeling', 'need'],
}

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    versions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tone: { type: 'string', description: '如 平和 / 直接 / 温和' },
          text: { type: 'string', description: '可直接发出去的自然中文，不要填空腔' },
        },
        required: ['tone', 'text'],
      },
    },
    request: { type: 'string', description: '正向、可执行、是请求不是命令' },
  },
  required: ['versions', 'request'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    stillBlaming: { type: 'boolean', description: '是否仍暗含指责/评判' },
    stillCommand: { type: 'boolean', description: '是否其实是命令（被拒会施压）' },
    fakeEmpathy: { type: 'boolean', description: '是否是套话式的伪共情' },
    fix: { type: 'string', description: '若有问题，给修正版；没问题则留空' },
  },
  required: ['text', 'stillBlaming', 'stillCommand', 'fakeEmpathy'],
}

const result = await pipeline(
  [{ raw, context }],
  (item) =>
    agent(
      `用非暴力沟通诊断这句话并抽取四要素。\n原话：「${item.raw}」\n背景：${item.context}\n` +
        `先标出其中的道德评判/比较/回避责任/强人所难，再给出中立的观察、具体的感受、说话人自身的需要。`,
      { label: 'diagnose', phase: 'Diagnose', schema: DIAG_SCHEMA }
    ),
  (diag) =>
    agent(
      `基于这些要素，生成 2 个口气不同、可直接发出去的非暴力版本，外加一个具体正向的请求。\n` +
        `观察：${diag.observation}\n感受：${diag.feeling}\n需要：${diag.need}\n背景：${context}\n` +
        `用自然中文，绝不要"当我看到…我感到…因为我需要…"那种填空腔。`,
      { label: 'draft', phase: 'Draft', schema: DRAFT_SCHEMA }
    ),
  (draft) =>
    parallel(
      draft.versions.map((v) => () =>
        agent(
          `对抗式检查这句改写，目标是挑毛病：它是不是其实还在指责？是不是伪装成请求的命令？是不是套话式伪共情？\n` +
            `「${v.text}」\n若有任一问题，给出修正版。`,
          { label: `verify:${v.tone}`, phase: 'Verify', schema: VERIFY_SCHEMA }
        )
      )
    ).then((checks) => ({ ...draft, checks: checks.filter(Boolean) })),
)

return result[0]
