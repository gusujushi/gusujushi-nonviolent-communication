# 非暴力沟通 · Claude Skill（nvc-communication）

一个用于 [Claude Code](https://claude.com/claude-code) 的沟通教练 skill。它把卢森堡《非暴力沟通》(Nonviolent Communication, NVC) 的方法落成一套**可被 AI 自动召回**的沟通助手：当你想表达不满、提出请求、拒绝别人、给负面反馈、道歉、处理愤怒，或单纯在抱怨某个人、纠结"该不该跟谁摊牌"时，它会先把指责性、评判性的话拆成 **观察 + 感受 + 需要 + 请求**，再给出可以直接用的措辞。

## 它能做什么

- **诊断器**：扫出你原话里的四种"异化沟通"——道德评判 / 比较 / 回避责任 / 强人所难，并改写。
- **双向四要素**：既帮你开口表达，也帮你接住对方的话（先共情对方的感受与需要）。
- **难局子流程**：愤怒四步、请求 vs 命令、拒绝、表达感激、爱自己。
- **场景分流**：对"要效率、无情绪"的事务性沟通只借用两条原则（观察不评论 + 具体请求），不把一切都套成填空腔。

## 设计取向

- **不机械**：四要素是内部思考脚手架，输出用自然中文，避免"当我看到…我感到…因为我需要…"那种公式腔。
- **召回优先**：description 覆盖措辞类、反应类、决策类三种开场，尽量不漏召、不误召。
- **不评判的姿态**：连你的"评判性原话"也不指责，把它当作"未满足需要的可悲表达"温和翻译。

## 安装

把 `nvc-communication/` 目录拷进你的 Claude 个人 skills 目录：

```bash
git clone https://github.com/gusujushi/gusujushi-nonviolent-communication.git
cp -r gusujushi-nonviolent-communication/nvc-communication ~/.claude/skills/
```

之后在 Claude Code 里，符合上述场景的对话会自动召回本 skill；也可手动用 `/nvc-communication` 触发。

## 许可证

代码与文档以 [MIT License](./LICENSE) 开源。

## 声明

本项目是一个**独立的学习与实践工具**，对《非暴力沟通》方法做了提炼与再组织，不含原书大段原文。

"Nonviolent Communication" 与 "NVC" 是非暴力沟通中心（Center for Nonviolent Communication, CNVC）的商标。**本项目与马歇尔·卢森堡（Marshall B. Rosenberg）遗产方、CNVC 及任何官方机构均无隶属、合作或背书关系。** 如需系统学习，请阅读原著并参考 CNVC 官方资源（https://www.cnvc.org）。
