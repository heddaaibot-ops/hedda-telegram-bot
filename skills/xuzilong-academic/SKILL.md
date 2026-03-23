---
name: xuzilong-academic
description: Use when working in Xu Zilong academic projects with Data/Program/Results/Manuscripts/Submissions and needing stable interfaces between generated results, hand-edited manuscript inserts, and submission artifacts.
---

# xuzilong 学术工作流总控

## 1) 触发条件
命中以下任一条件即触发：
1. 项目结构符合 `Data/Program/Results/Manuscripts/Submissions`。
2. 任务涉及清洗、估计、结果导出、稿件联动、投稿打包任一环节。

## 2) 目标
保持以下闭环：
`Program -> Results -> Manuscripts -> Submissions`

并保证：
1. 接口稳定。
2. 路径清晰。
3. 结果可复现。
4. 交付边界明确。

## 3) 层级地图
1. `Data/Raw`：原始快照，不覆盖。
2. `Data/Interim`：中间数据。
3. `Data/Final`：分析输入真源。
4. `Program/Clean`：稳定清洗脚本层；`temp/` 为可追踪探索层，`discarded/` 为不追踪废弃层。
5. `Program/Analysis`：稳定分析脚本层；`temp/` 为可追踪探索层，`discarded/` 为不追踪废弃层。
6. `Results/tab`：脚本生成的原始表格 `tex` 接口。
7. `Results/fig`：脚本生成的原始图形 `pdf + wrapper tex` 接口。
8. `Results/temp`：探索阶段保留的中间结果、测试证据与运行日志层；允许 git 追踪，但不是正式接口。
9. `Results/*Edited*`：作者手动整理后的稿件插入版本；属于手工维护层，不是脚本默认输出层。
10. `Manuscripts`：主稿层，消费 `Results` 标准接口或明确声明的 `Edited` 插入层。
11. `Submissions`：自包含提交包。
12. `Tasks`：仅在用户显式调用 `$xuzilong-task-tracking` 时启用；本 skill 不自动管理 `Tasks/`。

## 4) 路由规则
1. 数据口径变化：读取 `data-rules` 与 `program-clean-rules`。
2. 模型或回归变化：读取 `program-analysis-rules` 与 `results-rules`。
3. 仅文稿表达变化：读取 `manuscript-rules`。
4. 若命中写作模板任务：按 `manuscript-rules` 路由，并调用 `references/prompt-library.md` 的具体模板。
5. 投稿打包：读取 `submissions-rules`。
6. 期刊模板写作：先调用 `xuzilong-journal-style`，再回本 skill 执行整体约束。
7. 若用户显式调用 `$xuzilong-task-tracking`，则由该 skill 负责 `Tasks/` 的记录、更新与归档；本 skill 不自动启用 `Tasks`。
8. 若任务涉及 `Edited` 文件，先判断它是“稿件插入层”还是“脚本原始层”的替代物；默认按“稿件插入层”处理。
9. 若同时修改脚本、结果和稿件，必须先确认 raw result 与 `Edited` 的边界，再动文件。
10. 若任务包含探索性试错，默认先在从 `main` 派生的 worktree 分支中进行，再决定是否晋升到正式层。

## 5) 端到端流程
1. 明确目标与验收标准，并先区分产物属于“探索层”“脚本生成层”还是“手工 `Edited` 层”。
2. 识别受影响层；若任务包含探索性试错，默认先在从 `main` 派生的长期保留 worktree 分支中进行。
3. 探索脚本写入 `Program/*/temp/`；需要保留的探索证据与日志写入 `Results/temp/`；被明确放弃的脚本移入对应 `discarded/`。
4. 若探索结果稳定，不得直接把 `temp` 产物当正式接口；必须先将稳定逻辑提纯并迁移到正式 `Program` 层，再刷新 raw `Results/tab` 或 raw `Results/fig`。
5. 若改动仅影响稿件插入表现，可直接改 `Edited` 与 `Manuscripts`，但不得反向要求脚本覆盖 `Edited`。
6. 生成或更新标准接口产物。
7. 运行质量门禁。
8. 交付时说明修改范围、产物路径、复现入口，以及 `temp`/`discarded`/raw/`Edited` 的同步边界。

## 6) Edited 文件约定
1. `Edited` 表示作者手动修改后的最终插入版本，常用于小数位、标题、注释、列顺序、LaTeX 包装、手工高亮等稿件表达调整。
2. 与 `Edited` 对应的非 `Edited` 文件，表示脚本生成的原始可复现接口。
3. 默认关系是：`Program -> raw Results -> Edited -> Manuscripts`。
4. `Edited` 可以与 raw result 内容不同；两者不要求自动一致，也不应由脚本强制覆盖。
5. 若稿件当前引用 `Edited`，必须把它视为手工维护层；脚本修改只应保证 upstream raw result 正确，不得默认重写 `Edited`。

## 7) 约束
1. `Analysis` 输入必须来自 `Data/Final`。
2. `Program/Analysis` 负责生成 raw `Results/tab` 与 raw `Results/fig`。
3. `Manuscripts` 不直接消费 `Results/temp`。
4. 脚本不得默认写入、复制、覆盖、`replace` 任何 `*Edited*` 文件，除非用户明确要求改变接口设计。
5. 工具脚本或后处理脚本不得把 `Edited` 设为默认输入或默认输出，除非用户明确指定手工层为主要工作对象。
6. 若现有脚本已写入 `Edited`，视为接口耦合问题，修复时应改回只写 raw result。
7. `Results` 标准命名必须为 `tab1<ScriptName>` 或 `fig1<ScriptName>`，且 `label` 与文件名主干同名。
8. 不得因为稿件当前插入 `Edited`，就把脚本输出路径重定向到 `Edited`。
9. `temp` 是可追踪探索层；`discarded` 是不追踪废弃层，且不得被任何脚本默认引用。
10. `main` 不得直接接收 `temp` 作为正式接口；进入 `main` 前必须完成 `temp -> 正式脚本 -> raw Results` 的晋升。
11. `Results/temp` 可在探索分支内长期保留，但 `Manuscripts` 与 `Submissions` 永不消费它。
12. `Data/*` 不作为探索归档层；分析真源仍只认 `Data/Final`。
14. Stata 或其他工具生成的 `.log`、`.smcl`、诊断文本等日志类文件，不得写入项目根目录、`Manuscripts` 或 `Submissions`；默认写入 `Results/temp/` 下的对应目录。

## 8) 文件类型政策
1. 核心估计必须在 Stata `.do` 中实现。
2. Python 或 R 仅用于预处理、描述统计、诊断。
3. 最终表格使用 `tex`，最终图形使用 `pdf + wrapper tex`。

## 9) 规则优先级
1. 约束
2. 文件类型政策
3. `prompt-library` 模板硬约束
4. `manuscript-rules`
5. 其他参考材料

## 10) 质量门禁
1. 可复现。
2. 路径存在且为最新版本。
3. 稿件只引用标准接口或明确声明的 `Edited` 插入层。
4. 生成逻辑与 raw 产物一致。
5. `Edited` 与脚本隔离，搜索中不存在默认写入/覆盖 `*Edited*` 的脚本路径。
6. 标签与命名一致。
7. 日志类文件未污染项目根目录、`Manuscripts` 或 `Submissions`。
8. 交付说明完整，并注明 `temp`/`discarded`/raw/`Edited` 的边界。
