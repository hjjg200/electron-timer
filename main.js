const electron = require( 'electron' );
const url = require( 'url' );
const path = require( 'path' );

const { app, BrowserWindow, ipcMain } = electron;

const minSize = 32

let mainWindow;

ipcMain.on( 'close', function() {
  app.quit();
} );

ipcMain.on( 'magnify', ( e, ox, oy ) => {
  const w = Math.floor( mainWindow.getSize()[0] * 1.1 )
  setSizeWithOrigin( { w: w, h: w }, { x: ox, y: oy } )
} );

ipcMain.on( 'minify', ( e, ox, oy ) => {
  const w = Math.floor( mainWindow.getSize()[0] / 1.1 )
  setSizeWithOrigin( { w: w, h: w }, { x: ox, y: oy } )
} );

function setSizeWithOrigin( size, origin ) {
  if( size.w < minSize || size.h < minSize ) {
    size.w = minSize
    size.h = minSize
  }

  const [w, h] = mainWindow.getSize()
  const [owp, ohp] = [origin.x / w, origin.y / h]
  const [dw, dh] = [w - size.w, h - size.h]
  const bounds = mainWindow.getBounds()
  mainWindow.setBounds( {
    width: size.w,
    height: size.h,
    x: Math.floor( bounds.x + dw * owp ),
    y: Math.floor( bounds.y + dh * ohp )
  } );
}

app.on( 'ready', function() {
  mainWindow = new BrowserWindow( {
    minWidth: minSize,
    minHeight: minSize,
    width: 250,
    height: 250,
    frame: false,
    alwaysOnTop: true,
    transparent: true
  } );
  mainWindow.setResizable( false );
  mainWindow.setMinimumSize( minSize, minSize );
  mainWindow.loadURL( url.format( {
    pathname: path.join( __dirname, 'timer.html' ),
    protocol: 'file:',
    slashes: true
  } ) );
} );