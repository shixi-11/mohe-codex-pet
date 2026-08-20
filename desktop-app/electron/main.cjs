const { app, BrowserWindow, shell } = require('electron')
const path = require('node:path')
const fs = require('node:fs')

// Keep v1 local memory available after clarifying the desktop package name.
app.setPath('userData', path.join(app.getPath('appData'), 'mohe-codex-pet'))

function createWindow() {
  const win = new BrowserWindow({
    width: 1480,
    height: 960,
    minWidth: 980,
    minHeight: 700,
    show: false,
    backgroundColor: '#0c1013',
    autoHideMenuBar: true,
    title: '墨核 · Windows 桌面宠物',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  win.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'))
  win.once('ready-to-show', () => {
    if (process.env.MOHE_SMOKE_TEST !== '1') win.show()
  })
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.once('did-finish-load', () => {
    if (process.env.MOHE_SMOKE_TEST === '1') {
      win.webContents.executeJavaScript(`(async () => {
        const deadline = Date.now() + 15000
        let image = document.querySelector('.pet-stage .pet-visual')
        while ((!image || !image.complete || !image.naturalWidth) && Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          image = document.querySelector('.pet-stage .pet-visual')
        }
        return {
          title: document.title,
          textLength: document.body.innerText.trim().length,
          shell: Boolean(document.querySelector('.app-shell')),
          imageLoaded: Boolean(image?.complete && image?.naturalWidth)
        }
      })()`).then((report) => {
        if (process.env.MOHE_SMOKE_REPORT) {
          fs.writeFileSync(process.env.MOHE_SMOKE_REPORT, JSON.stringify(report))
        }
        app.quit()
      }).catch(() => app.exit(2))
    }
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
