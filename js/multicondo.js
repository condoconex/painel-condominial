/* css/style.css */
body {
  background: #f2f5fa;
  font-family: 'Montserrat', Segoe UI, Arial, sans-serif;
  margin: 0;
  padding: 0;
}
#painelPlugavel {
  box-shadow: 0 20px 64px #0057ff1a;
  border-radius: 24px;
  background: #fff;
  padding: 32px 18px 40px 18px;
  margin-top: 36px;
}
nav {
  margin-bottom: 24px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.btnAbaPlug {
  background: #e3f2fd;
  border: none;
  padding: 8px 22px;
  border-radius: 8px;
  font-weight: 600;
  color: #236ee8;
  font-size: 1.1em;
  box-shadow: 0 1px 5px #aed;
  transition: background .22s, color .22s;
  cursor: pointer;
}
.btnAbaPlug.active {
  background: #236ee8;
  color: #fff;
}
.abaPlugavel {
  animation: fadeInPlug .6s;
}
@keyframes fadeInPlug {
  from { opacity: 0; transform: translateY(22px);}
  to { opacity: 1; transform: translateY(0);}
}
label {
  margin-right: 24px;
  font-weight: 500;
}
input[type="text"], input[type="number"], input[type="date"], select {
  border: 1px solid #ccd8f2;
  border-radius: 5px;
  padding: 5px 9px;
  font-size: 1em;
  margin-left: 7px;
  margin-right: 8px;
  background: #f6f9ff;
  transition: box-shadow .18s;
}
input[type="text"]:focus, input[type="number"]:focus, input[type="date"]:focus, select:focus {
  outline: none;
  box-shadow: 0 2px 8px #236ee855;
  border-color: #236ee8;
  background: #e3f0ff;
}
canvas {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px #236ee80d;
  margin-bottom: 10px;
}
button {
  cursor: pointer;
}
@media (max-width: 900px) {
  #painelPlugavel {
    padding: 16px 5px 16px 5px;
  }
  nav {
    gap: 7px;
  }
  .btnAbaPlug {
    padding: 7px 8px;
    font-size: 0.97em;
  }
}
