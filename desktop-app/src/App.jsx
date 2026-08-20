import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const text = {
  greeting: '小主人，我在。今天也一起守住你的工作。',
  returnGreeting: '你回来了。我正好在这里。',
  groomingStart: '双击收到。毛刷模式开启，请从耳边轻轻梳起。',
  grooming: '嗯，就是这里。再慢一点。',
  groomingEnd: '毛刷收好了。谢谢小主人。',
}

const memories = [
  { id: 'character', title: '墨核角色卡', summary: '长期主义的本地小兽：安静、聪明，会护住重要基线，也会偶尔淘气打滚。', meta: '角色设定 · 本地记忆', tone: 'amber', icon: 'pet' },
  { id: 'baseline', title: '项目基线', summary: '记住重要决定与边界，让长期工作始终有迹可循。', meta: '长期项目 · 持续守护', tone: 'blue', icon: 'cube' },
  { id: 'writing', title: '中文写作', summary: '自然、顺、有人味，让技术和判断先进入具体场景。', meta: '表达习惯 · 已记住', tone: 'amber', icon: 'feather' },
  { id: 'skills', title: '技能工坊', summary: '把重要方法做成可跨任务复用的本地技能。', meta: 'Codex 能力 · 持续生长', tone: 'blue', icon: 'tools' },
]

const modes = [
  { id: 'companion', label: '陪伴', icon: 'pet' },
  { id: 'focus', label: '专注', icon: 'focus' },
  { id: 'memory', label: '记忆', icon: 'memory' },
  { id: 'workshop', label: '工坊', icon: 'tools' },
]

const modeCopy = {
  companion: { headline: '小主人，\n今天想守住什么？', status: '正在守护你的长期工作', action: '开始陪伴', activeAction: '暂停陪伴' },
  focus: { headline: '把注意力交给我，\n你只管向前。', status: '墨核会替你守住边界', action: '开始专注', activeAction: '结束专注' },
  memory: { headline: '重要的东西，\n不该每次从头解释。', status: '正在整理你的长期记忆', action: '查看记忆', activeAction: '收起记忆' },
  workshop: { headline: '把一次经验，\n炼成长久能力。', status: '技能工坊正在待命', action: '点亮工坊', activeAction: '让工坊休息' },
}

const visuals = [
  { id: 'idle', src: './assets/mohe-idle-v2-cutout.png', alt: '静静守候的墨核' },
  { id: 'curious', src: './assets/mohe-curious-cutout.png', alt: '歪头好奇的墨核' },
  { id: 'pleased', src: './assets/mohe-pleased-cutout.png', alt: '舒服地回应触碰的墨核' },
  { id: 'alert', src: './assets/mohe-alert-cutout.png', alt: '抬起前爪警觉的墨核' },
  { id: 'roll', src: './assets/mohe-roll.png', alt: '打滚的墨核' },
  { id: 'furball', src: './assets/mohe-furball.png', alt: '卷成毛团的墨核' },
]

const regions = [
  { id: 'ear', label: '耳边', left: '51%', top: '12%', width: '22%', height: '22%' },
  { id: 'head', label: '头顶', left: '43%', top: '26%', width: '25%', height: '18%' },
  { id: 'chest', label: '胸口', left: '46%', top: '43%', width: '24%', height: '22%' },
  { id: 'paws', label: '前爪', left: '43%', top: '67%', width: '25%', height: '19%' },
  { id: 'tail', label: '尾巴', left: '67%', top: '62%', width: '30%', height: '28%' },
]

const responses = {
  ear: { sequence: ['alert', 'curious', 'idle'], message: '耳朵听见了。这里有一点新的动静。', activity: '轻触耳边，墨核听见了' },
  head: { sequence: ['curious', 'pleased', 'idle'], message: '轻轻碰到头顶了。我会记住这个触碰。', activity: '轻触头顶，墨核歪了一下头' },
  chest: { sequence: ['pleased', 'furball', 'pleased'], message: '胸口的核心亮了一下。谢谢你。', activity: '触碰胸口核心，光圈亮起' },
  paws: { sequence: ['pleased', 'roll', 'idle'], message: '爪子收到轻轻一拍，我也回你一个小动作。', activity: '轻触前爪，墨核回拍' },
  tail: { sequence: ['curious', 'roll', 'idle'], message: '尾巴被碰到了。我来回摇一下。', activity: '轻触尾巴，墨核回了一个小动作' },
  body: { sequence: ['curious', 'pleased', 'idle'], message: '收到。你碰到我了。', activity: '触碰墨核，它回应了你' },
}

const brushResponses = {
  ear: { visual: 'pleased', message: '耳根这里最痒。轻一点，我会把耳朵放松下来。', activity: '毛刷经过耳边，墨核耳朵放松' },
  head: { visual: 'pleased', message: '头顶这一道很舒服。可以保持这个姿势再梳两下。', activity: '毛刷经过头顶，墨核眯起眼睛' },
  chest: { visual: 'pleased', message: '胸口暖起来了。慢慢刷，我会一直享受着。', activity: '毛刷经过胸口，核心变得温暖' },
  paws: { visual: 'roll', message: '前爪也照顾到了。先保持这个小滚姿势。', activity: '毛刷经过前爪，墨核保持翻身回应' },
  tail: { visual: 'furball', message: '尾巴梳顺了。我先卷成毛团，等你继续。', activity: '毛刷经过尾巴，墨核保持毛团姿势' },
}
const brushAngles = { ear: -120, head: -128, chest: -132, paws: 48, tail: 4 }
const ambientActions = [
  { visual: 'curious', message: '我看看小主人还在不在。', activity: '墨核抬头看了一眼' },
  { visual: 'pleased', message: '嗯，今天的心情很安静。', activity: '墨核舒服地眯了一会儿眼' },
  { visual: 'roll', message: '突然想在地上滚一下。', activity: '墨核自己打了个滚' },
  { visual: 'furball', message: '先把自己卷成一小团。', activity: '墨核卷成毛团休息' },
]
const workshopActions = [
  { id: 'roll', label: '打滚', detail: '测试淘气动作', visual: 'roll', message: '动作预览：我可以随时打个滚。' },
  { id: 'furball', label: '毛团', detail: '测试安静状态', visual: 'furball', message: '动作预览：卷成毛团，安静守着。' },
  { id: 'waving', label: '招呼', detail: '测试见面回应', visual: 'curious', message: '动作预览：小主人，我在这里。' },
  { id: 'pleased', label: '享受', detail: '测试被摸反馈', visual: 'pleased', message: '动作预览：这一下很舒服。' },
]
const focusLimit = 25 * 60
const timeNow = () => new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())
const formatTimer = (value) => {
  const minutes = String(Math.floor(value / 60)).padStart(2, '0')
  const seconds = String(value % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function Icon({ name, size = 22 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    pet: <><path d="M7.5 9 5 4l5 2.2h4L19 4l-1.7 5.2c1.1 1 1.7 2.4 1.7 4 0 3.8-3 6.8-7 6.8s-7-3-7-6.8c0-1.7.9-3.1 2.5-4.2Z"/><path d="M9 13.5h.01M15 13.5h.01M10 17c1.3.7 2.7.7 4 0"/></>,
    focus: <><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
    memory: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></>,
    tools: <><path d="m14.7 6.3 3-3a4 4 0 0 1-5 5l-7.4 7.4a2.1 2.1 0 0 0 3 3l7.4-7.4a4 4 0 0 1 5-5l-3 3"/><path d="m5 4 4 4M3.5 2.5 6 3l1 2-2 2-2-1-.5-2.5Z"/></>,
    cube: <><path d="m12 2 8 4.5v9L12 22l-8-6.5v-9L12 2Z"/><path d="m4.4 6.7 7.6 4.6 7.6-4.6M12 11.3V22"/></>,
    feather: <><path d="M20.5 3.5c-7 0-12.4 3.7-14.5 10.6L3 21l6.9-3c6.9-2.2 10.6-7.5 10.6-14.5Z"/><path d="M6 18c3.3-4.7 6.5-7.7 11-10"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>,
    spark: <><path d="m12 2 1.4 5.1L18 10l-4.6 2.9L12 18l-1.4-5.1L6 10l4.6-2.9L12 2Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    folder: <><path d="M3 6.5h7l2 2h9v10.5H3V6.5Z"/><path d="M3 9h18"/></>,
    database: <><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.5 2.7 8.3 7 10 4.3-1.7 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    code: <><path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 6l-4 12"/></>,
    terminal: <><path d="m5 7 4 5-4 5M11 17h8"/></>,
  }
  return <svg {...common}>{paths[name] || paths.spark}</svg>
}

function MemoryItem({ item, onOpen }) {
  return <button className="memory-item" onClick={() => onOpen(item)} type="button"><span className={'memory-icon ' + (item.tone || 'blue')}><Icon name={item.icon || 'spark'} size={25} /></span><span className="memory-copy"><span className="memory-title">{item.title}</span><span className="memory-summary">{item.summary}</span><span className="memory-meta">{item.meta}</span></span><span className="memory-open" aria-hidden="true"><Icon name="chevron" size={17} /></span></button>
}

function App() {
  const [activeMode, setActiveMode] = useState('companion')
  const [isActive, setIsActive] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [command, setCommand] = useState('')
  const [reaction, setReaction] = useState('')
  const [petPulse, setPetPulse] = useState(false)
  const [petVisualId, setPetVisualId] = useState('idle')
  const [grooming, setGrooming] = useState(false)
  const [brushPoint, setBrushPoint] = useState(null)
  const [brushRegion, setBrushRegion] = useState(null)
  const [brushAngle, setBrushAngle] = useState(-132)
  const [lastInteractionAt, setLastInteractionAt] = useState(() => Date.now())
  const [memoryExpanded, setMemoryExpanded] = useState(false)
  const [customMemories, setCustomMemories] = useState(() => { try { return JSON.parse(localStorage.getItem('mohe-memories') || '[]') } catch { return [] } })
  const [activities, setActivities] = useState(() => [{ time: timeNow(), text: '墨核已经在这里待命' }, { time: '长期', text: '项目基线保持在本地记忆中' }, { time: '偏好', text: '表达习惯已加载' }])
  const reactionTimer = useRef(null)
  const sequenceTimers = useRef([])
  const sequenceToken = useRef(0)
  const brushMessageAt = useRef(0)
  const brushResetTimer = useRef(null)
  const ambientTimer = useRef(null)
  const mode = modeCopy[activeMode]

  useEffect(() => { localStorage.setItem('mohe-memories', JSON.stringify(customMemories)) }, [customMemories])
  useEffect(() => { if (!isActive) return undefined; const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(timer) }, [isActive])
  useEffect(() => () => { window.clearTimeout(reactionTimer.current); sequenceTimers.current.forEach((timer) => window.clearTimeout(timer)) }, [])
  useEffect(() => { visuals.forEach(({ src }) => { const image = new Image(); image.src = src }) }, [])

  const visibleMemories = useMemo(() => memoryExpanded ? [...customMemories, ...memories] : [...customMemories.slice(0, 1), ...memories], [customMemories, memoryExpanded])
  const addActivity = useCallback((value) => setActivities((items) => [{ time: timeNow(), text: value }, ...items].slice(0, 6)), [])
  const showReaction = useCallback((value) => { setReaction(value); setPetPulse(true); setLastInteractionAt(Date.now()); window.clearTimeout(reactionTimer.current); reactionTimer.current = window.setTimeout(() => { setReaction(''); setPetPulse(false) }, 3600) }, [])
  const clearSequence = useCallback(() => { sequenceTimers.current.forEach((timer) => window.clearTimeout(timer)); sequenceTimers.current = [] }, [])
  const runSequence = useCallback((ids, message, activity) => { const token = ++sequenceToken.current; clearSequence(); ids.forEach((id, index) => sequenceTimers.current.push(window.setTimeout(() => { if (token === sequenceToken.current) setPetVisualId(id) }, index * 620))); sequenceTimers.current.push(window.setTimeout(() => { if (token === sequenceToken.current) { setPetVisualId('idle'); setPetPulse(false) } }, ids.length * 620 + 180)); showReaction(message); if (activity) addActivity(activity) }, [addActivity, clearSequence, showReaction])
  useEffect(() => { if (activeMode !== 'focus' || !isActive || seconds < focusLimit) return; setIsActive(false); setSeconds(0); runSequence(['alert', 'pleased', 'idle'], '这一轮专注完成了。先抬头呼吸一下。', '专注计时完成，墨核提醒休息') }, [activeMode, isActive, seconds, runSequence])

  useEffect(() => { let greeted = false; try { greeted = sessionStorage.getItem('mohe-greeted') === '1' } catch {} if (greeted) return undefined; const timer = window.setTimeout(() => { runSequence(['idle', 'waving', 'idle'], text.greeting, '墨核第一次见到你，先打个招呼'); try { sessionStorage.setItem('mohe-greeted', '1') } catch {} }, 700); return () => window.clearTimeout(timer) }, [runSequence])
  useEffect(() => { const timer = window.setInterval(() => { if (!grooming && Date.now() - lastInteractionAt > 90000) { runSequence(['idle', 'curious', 'waving', 'idle'], text.returnGreeting, '墨核注意到你回来了'); setLastInteractionAt(Date.now()) } }, 30000); return () => window.clearInterval(timer) }, [grooming, lastInteractionAt, runSequence])
  useEffect(() => {
    if (activeMode !== 'companion' || isActive || grooming) return undefined
    const delay = 24000 + Math.floor(Math.random() * 16000)
    ambientTimer.current = window.setTimeout(() => {
      const action = ambientActions[Math.floor(Math.random() * ambientActions.length)]
      runSequence([action.visual, 'idle'], action.message, action.activity)
    }, delay)
    return () => window.clearTimeout(ambientTimer.current)
  }, [activeMode, isActive, grooming, lastInteractionAt, runSequence])
  useEffect(() => { const onContextMenu = (event) => { if (!grooming) return; event.preventDefault(); window.clearTimeout(brushResetTimer.current); setGrooming(false); setBrushPoint(null); setBrushRegion(null); setBrushAngle(-132); runSequence(['pleased', 'idle'], text.groomingEnd, '毛刷模式结束') }; window.addEventListener('contextmenu', onContextMenu); return () => window.removeEventListener('contextmenu', onContextMenu) }, [grooming, runSequence])

  const chooseMode = (nextMode) => { setActiveMode(nextMode); setIsActive(false); setSeconds(0); setMemoryExpanded(false); const messages = { companion: '我在。慢一点也没关系。', focus: '边界交给我，你只看眼前这一件事。', memory: '重要的线索已经归拢好了。', workshop: '方法经过打磨，才会变成能力。' }; runSequence(['curious', 'idle'], messages[nextMode], '切换到' + modes.find((item) => item.id === nextMode)?.label + '模式') }
  const togglePrimary = () => {
    if (activeMode === 'memory') { const next = !memoryExpanded; setMemoryExpanded(next); showReaction(next ? '本地记忆展开了，可以逐条打开。' : '记忆轨道收起了。'); addActivity(next ? '展开全部本地记忆' : '收起本地记忆'); return }
    if (activeMode === 'workshop') { runSequence(['curious', 'idle'], '动作工坊已点亮。可以从右侧挑一个动作预览。', '打开动作工坊'); return }
    const next = !isActive; setIsActive(next); if (!next) setSeconds(0); addActivity(next ? modes.find((item) => item.id === activeMode)?.label + '状态已开启' : '墨核回到静守状态'); runSequence(next ? ['alert', 'idle'] : ['pleased', 'idle'], next ? '好。接下来这一段，我陪你守住。' : '我会留在这里，等你再开口。', null)
  }
  const handleRegion = (region) => { setLastInteractionAt(Date.now()); const response = responses[region] || responses.body; runSequence(response.sequence, response.message, response.activity) }
  const handleDoubleClick = (event) => { event.preventDefault(); window.clearTimeout(brushResetTimer.current); setGrooming(true); setBrushPoint(null); setBrushRegion(null); setBrushAngle(-132); runSequence(['curious', 'pleased'], text.groomingStart, '双击墨核，进入毛刷模式') }
  const handleBrushMove = (event) => {
    if (!grooming) return
    window.clearTimeout(brushResetTimer.current)
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const region = y < 27 ? 'ear' : y < 42 ? 'head' : y < 65 ? 'chest' : x > 62 ? 'tail' : 'paws'
    setBrushPoint({ x: x + '%', y: y + '%' })
    setBrushAngle(brushAngles[region] || -132)
    const response = brushResponses[region]
    const now = Date.now()
    const regionChanged = region !== brushRegion
    if (regionChanged) {
      setBrushRegion(region)
      sequenceToken.current += 1
      clearSequence()
      setPetVisualId(response.visual)
      setPetPulse(true)
    }
    if (regionChanged || now - brushMessageAt.current > 2200) {
      brushMessageAt.current = now
      showReaction(response.message)
      addActivity(response.activity)
    }
  }
  const handleBrushLeave = () => {
    if (!grooming) return
    setBrushPoint(null)
    window.clearTimeout(brushResetTimer.current)
    brushResetTimer.current = window.setTimeout(() => {
      setBrushRegion(null)
      setBrushAngle(-132)
      setPetVisualId('idle')
      setPetPulse(false)
    }, 950)
  }
  const openMemory = (item) => runSequence(['curious', 'idle'], item.summary, '打开记忆：' + item.title)
  const submitCommand = (event) => { event.preventDefault(); const value = command.trim(); if (!value) { showReaction('先告诉我，你不想丢掉哪件事。'); return }; const memory = { id: 'custom-' + Date.now(), title: value.length > 12 ? value.slice(0, 12) + '…' : value, summary: value, meta: '刚刚记住 · 仅保存在本地', tone: 'amber', icon: 'spark' }; setCustomMemories((items) => [memory, ...items].slice(0, 6)); setCommand(''); runSequence(['alert', 'pleased', 'idle'], '记住了：' + value, '新增长期记忆：' + memory.title) }
  const handleWorkshopAction = (action) => { runSequence([action.visual, 'idle'], action.message, '工坊预览：' + action.label); setPetPulse(true) }
  const applyComposerTool = (kind) => { if (kind === 'memory') { setActiveMode('memory'); setMemoryExpanded(true); return }; const prefixes = { tag: '# ', code: String.fromCharCode(96), terminal: '/ ' }; setCommand((value) => value || prefixes[kind] || '') }
  const petVisual = visuals.find((item) => item.id === petVisualId) || visuals[0]

  return <main className={'app-shell mode-' + activeMode + (isActive ? ' is-active' : '') + (grooming ? ' grooming-mode' : '')}>
    <aside className="side-rail" aria-label="墨核主导航"><div className="brand" aria-label="墨核"><span className="brand-orbit" aria-hidden="true" /><span>墨核</span></div><nav className="mode-nav">{modes.map((item) => <button key={item.id} className={activeMode === item.id ? 'selected' : ''} onClick={() => chooseMode(item.id)} type="button"><Icon name={item.icon} size={23} /><span>{item.label}</span></button>)}</nav><div className="local-state"><span className="local-title"><i /> 本地模式</span><span><Icon name="folder" size={15} /> 工作区 · 本地目录</span><span><Icon name="database" size={15} /> 数据与记忆 · 本地储存</span><span><Icon name="cube" size={15} /> 交互 · 本地优先</span></div></aside>
    <section className="habitat" aria-label="墨核的栖息地"><div className="intro"><h1>{mode.headline.split('\n').map((line) => <span key={line}>{line}</span>)}</h1><p className="guardian-status"><i /> {grooming ? '毛刷模式：右键退出' : (reaction || mode.status)}</p>{isActive && <div className="focus-clock" aria-live="polite"><Icon name="clock" size={18} /><span>{activeMode === 'focus' ? '25分钟 · ' : ''}{formatTimer(seconds)}</span></div>}<button className="primary-action" onClick={togglePrimary} type="button"><span className="action-core"><i /></span>{activeMode === 'memory' ? (memoryExpanded ? mode.activeAction : mode.action) : (isActive ? mode.activeAction : mode.action)}</button></div>
      <div className={'pet-stage ' + (petPulse ? 'reacting ' : '') + (grooming ? 'is-grooming' : '')} role="button" tabIndex={0} onClick={() => handleRegion('body')} onDoubleClick={handleDoubleClick} onPointerMove={handleBrushMove} onPointerLeave={handleBrushLeave} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleRegion('body') }} aria-label={grooming ? '毛刷模式，右键退出' : '轻触、双击或点击墨核'}><span className="orbit orbit-one" aria-hidden="true" /><span className="orbit orbit-two" aria-hidden="true" />{reaction && <span className="pet-response" aria-live="polite">{reaction}</span>}{grooming && <span className="grooming-hint">毛刷模式<small>右键退出</small></span>}{brushPoint && grooming && <img className="pet-brush" src="./assets/mohe-brush.png" style={{ left: brushPoint.x, top: brushPoint.y, '--brush-angle': brushAngle + 'deg' }} alt="" aria-hidden="true" />}<span className="pet-hint">轻触墨核 · 双击梳毛</span>{regions.map((region) => <button key={region.id} type="button" className="pet-hotspot" style={{ left: region.left, top: region.top, width: region.width, height: region.height }} aria-label={'轻触' + region.label} onClick={(event) => { event.stopPropagation(); handleRegion(region.id) }} onDoubleClick={(event) => { event.stopPropagation(); handleDoubleClick(event) }} />)}<img key={petVisual.id} className={'pet-visual pet-visual--' + petVisual.id} src={petVisual.src} alt={petVisual.alt} /></div>
      <form className="command-composer" onSubmit={submitCommand}><div className="composer-mark" aria-hidden="true"><Icon name="spark" size={19} /></div><label htmlFor="mohe-command" className="sr-only">告诉墨核一件事</label><input id="mohe-command" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="告诉墨核一件事…" autoComplete="off" /><div className="composer-tools" aria-label="输入工具"><button type="button" onClick={() => applyComposerTool('tag')} aria-label="添加主题标记">#</button><button type="button" onClick={() => applyComposerTool('code')} aria-label="添加代码标记"><Icon name="code" size={18} /></button><button type="button" onClick={() => applyComposerTool('memory')} aria-label="打开记忆模式"><Icon name="memory" size={17} /></button><button type="button" onClick={() => applyComposerTool('terminal')} aria-label="添加命令标记"><Icon name="terminal" size={18} /></button></div><button className="composer-mode" type="button" onClick={() => showReaction('这条记忆只会留在你的本地设备。')}>守护并记住<Icon name="chevron" size={14} /></button><button className="composer-send" type="submit" aria-label="守护并记住"><Icon name="send" size={21} /></button><span className="composer-note">按 Enter 发送</span></form>
    </section>
    <aside className="memory-rail" aria-label="记忆轨道"><header className="rail-header"><span><Icon name="memory" size={20} /> 记忆轨道</span><small>{customMemories.length + memories.length} 条守护线索</small></header><div className="memory-list">{visibleMemories.slice(0, memoryExpanded ? visibleMemories.length : 3).map((item) => <MemoryItem key={item.id} item={item} onOpen={openMemory} />)}</div>{activeMode === 'workshop' && <section className="workshop-panel"><header><span>动作工坊</span><small>本地预览</small></header><div className="workshop-actions">{workshopActions.map((action) => <button key={action.id} type="button" onClick={() => handleWorkshopAction(action)}><strong>{action.label}</strong><small>{action.detail}</small></button>)}</div></section>}<section className="activity-trace"><header><span>实时动态</span><small><i /> {isActive ? '守护中' : '待命'}</small></header><ol>{activities.map((activity, index) => <li key={activity.time + activity.text + index}><time>{activity.time}</time><span>{activity.text}</span></li>)}</ol></section></aside>
    <footer className="status-bar"><span className="status-path">本地工作区</span><span><i className="amber-dot" /> 未提交的灵感</span><span className="status-spacer" /><span><Icon name="shield" size={16} /> {isActive ? '守护中' : '本地待命'}</span><span className="status-divider" /><span><Icon name="cube" size={16} /> 墨核 · 本地宠物</span></footer>
  </main>
}

export default App
