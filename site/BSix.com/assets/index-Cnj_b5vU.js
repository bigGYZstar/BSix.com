var G=Object.defineProperty;var U=(e,t,s)=>t in e?G(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var p=(e,t,s)=>U(e,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=s(a);fetch(a.href,r)}})();const S={currentFixture:null,selectedTab:"overview",selectedTeam:"home",theme:"auto",modalPlayer:null,loading:!1,error:null};class W{constructor(){p(this,"state",{...S});p(this,"listeners",new Set);this.loadPersistedState()}getState(){return{...this.state}}setState(t){const s={...this.state};this.state={...this.state,...t},this.hasStateChanged(s,this.state)&&(this.persistState(),this.notifyListeners())}subscribe(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}notifyListeners(){const t=this.getState();this.listeners.forEach(s=>{try{s(t)}catch(n){console.error("State listener error:",n)}})}hasStateChanged(t,s){return JSON.stringify(t)!==JSON.stringify(s)}loadPersistedState(){try{const t=localStorage.getItem("match-preview-theme");t&&["light","dark","auto"].includes(t)&&(this.state.theme=t);const s=localStorage.getItem("match-preview-tab");s&&["overview","tactics","lineup","timeline"].includes(s)&&(this.state.selectedTab=s);const n=localStorage.getItem("match-preview-team");n&&["home","away"].includes(n)&&(this.state.selectedTeam=n)}catch(t){console.warn("Failed to load persisted state:",t)}}persistState(){try{localStorage.setItem("match-preview-theme",this.state.theme),localStorage.setItem("match-preview-tab",this.state.selectedTab),localStorage.setItem("match-preview-team",this.state.selectedTeam)}catch(t){console.warn("Failed to persist state:",t)}}setFixture(t){this.setState({currentFixture:t,error:null})}setTab(t){this.setState({selectedTab:t})}setTeam(t){this.setState({selectedTeam:t})}setTheme(t){this.setState({theme:t}),this.applyThemeToDOM(t)}setLoading(t){this.setState({loading:t})}setError(t){this.setState({error:t,loading:!1})}setModalPlayer(t){this.setState({modalPlayer:t})}reset(){this.state={...S},this.persistState(),this.notifyListeners()}getCurrentTeam(){const t=this.state.currentFixture;return t?this.state.selectedTeam==="home"?t.home:t.away:null}getOpponentTeam(){const t=this.state.currentFixture;return t?this.state.selectedTeam==="home"?t.away:t.home:null}applyThemeToDOM(t){const s=document.documentElement;s.removeAttribute("data-theme"),t==="light"?s.setAttribute("data-theme","light"):t==="dark"&&s.setAttribute("data-theme","dark")}applyInitialTheme(){this.applyThemeToDOM(this.state.theme)}}const u=new W;function T(e){return u.subscribe(e)}function j(e){u.setFixture(e)}function H(e){u.setTab(e)}function q(e){u.setTeam(e)}function C(e){u.setLoading(e)}function E(e){u.setError(e)}function F(){u.applyInitialTheme()}const V=Object.freeze(Object.defineProperty({__proto__:null,applyInitialTheme:F,setActiveTab:H,setActiveTeam:q,setError:E,setFixture:j,setLoading:C,stateManager:u,subscribeToState:T},Symbol.toStringTag,{value:"Module"})),w={"#overview":"overview","#tactics":"tactics","#lineup":"lineup","#timeline":"timeline"},D={overview:"概要",tactics:"戦術",lineup:"布陣",timeline:"タイムライン"};class J{constructor(){p(this,"currentRoute","overview");p(this,"listeners",new Set);this.init()}init(){window.addEventListener("hashchange",this.handleHashChange.bind(this)),this.handleHashChange(),T(t=>{t.selectedTab!==this.currentRoute&&this.updateURL(t.selectedTab)})}handleHashChange(){const t=window.location.hash||"#overview",s=w[t];s&&s!==this.currentRoute?this.navigateTo(s,!1):s||this.navigateTo("overview",!0)}navigateTo(t,s=!0){this.currentRoute=t,H(t),s&&this.updateURL(t),this.updatePageTitle(t),this.notifyListeners(t)}updateURL(t){const s=Object.keys(w).find(n=>w[n]===t)||"#overview";window.location.hash!==s&&window.history.pushState(null,"",s)}updatePageTitle(t){const s=D[t]||"試合プレビュー";document.title=`${s} - 試合プレビュー`}subscribe(t){return this.listeners.add(t),()=>{this.listeners.delete(t)}}notifyListeners(t){this.listeners.forEach(s=>{try{s(t)}catch(n){console.error("Router listener error:",n)}})}getCurrentRoute(){return this.currentRoute}isValidRoute(t){return["overview","tactics","lineup","timeline"].includes(t)}back(){window.history.back()}forward(){window.history.forward()}handlePopState(){this.handleHashChange()}}const g=new J;function Q(e){return g.subscribe(e)}function z(){return Object.entries(w).map(([e,t])=>({route:t,title:D[t],hash:e}))}function Z(){const e=["overview","tactics","lineup","timeline"];document.addEventListener("keydown",t=>{if(document.querySelector(".modal-backdrop"))return;const s=document.activeElement;if(s&&(s.tagName==="INPUT"||s.tagName==="TEXTAREA"))return;const n=g.getCurrentRoute(),a=e.indexOf(n);t.key==="ArrowLeft"&&a>0?(t.preventDefault(),g.navigateTo(e[a-1])):t.key==="ArrowRight"&&a<e.length-1&&(t.preventDefault(),g.navigateTo(e[a+1]))})}function Y(){window.addEventListener("popstate",()=>{g.handlePopState()}),Z()}function X(e=40){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景（赤） -->
      <circle cx="50" cy="50" r="48" fill="var(--team-ars)" stroke="var(--team-ars-secondary)" stroke-width="2"/>
      
      <!-- 大砲（簡略化） -->
      <rect x="25" y="45" width="50" height="8" rx="4" fill="var(--team-ars-secondary)"/>
      <circle cx="30" cy="49" r="6" fill="var(--team-ars-secondary)"/>
      <circle cx="70" cy="49" r="4" fill="var(--team-ars-secondary)"/>
      
      <!-- 装飾線 -->
      <path d="M 20 35 Q 50 25 80 35" stroke="var(--team-ars-secondary)" stroke-width="2" fill="none"/>
      <path d="M 20 65 Q 50 75 80 65" stroke="var(--team-ars-secondary)" stroke-width="2" fill="none"/>
      
      <!-- 中央のディテール -->
      <circle cx="50" cy="49" r="3" fill="var(--team-ars)"/>
      
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="var(--team-ars-secondary)">ARS</text>
    </svg>
  `.trim()}function tt(e=40){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景（白） -->
      <circle cx="50" cy="50" r="48" fill="var(--team-lee)" stroke="var(--team-lee-secondary)" stroke-width="3"/>
      
      <!-- 内側の青いサークル -->
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--team-lee-secondary)" stroke-width="2"/>
      
      <!-- ローズ（薔薇）のシンボル（簡略化） -->
      <circle cx="50" cy="40" r="8" fill="var(--team-lee-secondary)"/>
      <circle cx="45" cy="48" r="5" fill="var(--team-lee-secondary)"/>
      <circle cx="55" cy="48" r="5" fill="var(--team-lee-secondary)"/>
      <circle cx="50" cy="55" r="6" fill="var(--team-lee-secondary)"/>
      
      <!-- 茎 -->
      <rect x="48" y="55" width="4" height="15" fill="var(--team-lee-secondary)"/>
      
      <!-- 葉 -->
      <ellipse cx="42" cy="62" rx="4" ry="2" fill="var(--team-lee-secondary)" transform="rotate(-30 42 62)"/>
      <ellipse cx="58" cy="62" rx="4" ry="2" fill="var(--team-lee-secondary)" transform="rotate(30 58 62)"/>
      
      <text x="50" y="85" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="var(--team-lee-secondary)">LEE</text>
    </svg>
  `.trim()}function et(e=40,t="TM"){return`
    <svg width="${e}" height="${e}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景 -->
      <circle cx="50" cy="50" r="48" fill="var(--color-primary)" stroke="var(--color-bg)" stroke-width="2"/>
      
      <!-- サッカーボール -->
      <circle cx="50" cy="45" r="18" fill="var(--color-bg)" stroke="var(--color-text-main)" stroke-width="2"/>
      
      <!-- ボールのパターン -->
      <polygon points="50,30 58,38 54,48 46,48 42,38" fill="var(--color-text-main)"/>
      <polygon points="50,60 42,52 46,42 54,42 58,52" fill="var(--color-text-main)"/>
      
      <!-- チーム名 -->
      <text x="50" y="80" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="var(--color-bg)">${t}</text>
    </svg>
  `.trim()}function f(e,t=40){switch(e.toLowerCase()){case"ars":case"arsenal":return X(t);case"lee":case"leeds":return tt(t);default:return et(t,e.toUpperCase().slice(0,3))}}function h(e){switch(e.toLowerCase()){case"ars":case"arsenal":return{primary:"var(--team-ars)",secondary:"var(--team-ars-secondary)",cssClass:"team-ars"};case"lee":case"leeds":return{primary:"var(--team-lee)",secondary:"var(--team-lee-secondary)",cssClass:"team-lee"};default:return{primary:"var(--color-primary)",secondary:"var(--color-bg)",cssClass:"team-default"}}}function st(e,t,s=100){const n=Math.max(...e),a=s/2,r=s/2,i=s*.35,o=e.map((c,l)=>{const d=l*2*Math.PI/e.length-Math.PI/2,v=c/n*i,y=a+Math.cos(d)*v,m=r+Math.sin(d)*v;return`${y},${m}`}).join(" ");return`
    <svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
      <!-- 背景グリッド -->
      <circle cx="${a}" cy="${r}" r="${i*.2}" fill="none" stroke="var(--color-border)" stroke-width="1" opacity="0.3"/>
      <circle cx="${a}" cy="${r}" r="${i*.5}" fill="none" stroke="var(--color-border)" stroke-width="1" opacity="0.3"/>
      <circle cx="${a}" cy="${r}" r="${i*.8}" fill="none" stroke="var(--color-border)" stroke-width="1" opacity="0.3"/>
      
      <!-- データエリア -->
      <polygon points="${o}" fill="var(--color-primary)" fill-opacity="0.3" stroke="var(--color-primary)" stroke-width="2"/>
      
      <!-- データポイント -->
      ${e.map((c,l)=>{const d=l*2*Math.PI/e.length-Math.PI/2,v=c/n*i,y=a+Math.cos(d)*v,m=r+Math.sin(d)*v;return`<circle cx="${y}" cy="${m}" r="3" fill="var(--color-primary)"/>`}).join("")}
    </svg>
  `.trim()}async function nt(e){const t=document.createElement("div");t.className="overview-section";const s=at(e);t.appendChild(s);const n=rt(e);t.appendChild(n);const a=it(e);return t.appendChild(a),t}function at(e){const t=document.createElement("div");t.className="card mb-6";const s=new Date(e.dateJST),n=s.toLocaleDateString("ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"}),a=s.toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});return t.innerHTML=`
    <div class="card-header">
      <h2 class="card-title">試合情報</h2>
      <div class="card-subtitle">${e.league} ${e.round}</div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-secondary">日時:</span>
          <div>
            <div class="font-medium">${n}</div>
            <div class="text-sm text-muted">${a} キックオフ</div>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-secondary">会場:</span>
          <span class="font-medium">${e.venue}</span>
        </div>
      </div>
      
      ${e.weather?`
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-secondary">天候:</span>
            <div>
              <div class="font-medium">${e.weather.condition||"不明"}</div>
              ${e.weather.temperature?`<div class="text-sm text-muted">${e.weather.temperature}°C</div>`:""}
            </div>
          </div>
          
          ${e.referee?`
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-secondary">主審:</span>
              <span class="font-medium">${e.referee.main||"未定"}</span>
            </div>
          `:""}
        </div>
      `:""}
    </div>
  `,t}function rt(e){const t=document.createElement("div");t.className="card mb-6";const s=f(e.home.teamId,80),n=f(e.away.teamId,80);return t.innerHTML=`
    <div class="text-center py-8">
      <div class="flex items-center justify-center gap-8 mb-6">
        <!-- ホームチーム -->
        <div class="flex flex-col items-center flex-1">
          <div class="mb-4">${s}</div>
          <h3 class="text-xl font-bold mb-2">${e.home.name}</h3>
          <div class="text-sm text-muted">${e.home.key}</div>
          <div class="text-xs text-muted mt-1">ホーム</div>
        </div>
        
        <!-- VS -->
        <div class="flex flex-col items-center">
          <div class="text-2xl font-bold text-primary mb-2">VS</div>
          <div class="text-xs text-muted">${e.league}</div>
        </div>
        
        <!-- アウェイチーム -->
        <div class="flex flex-col items-center flex-1">
          <div class="mb-4">${n}</div>
          <h3 class="text-xl font-bold mb-2">${e.away.name}</h3>
          <div class="text-sm text-muted">${e.away.key}</div>
          <div class="text-xs text-muted mt-1">アウェイ</div>
        </div>
      </div>
      
      <!-- フォーメーション情報 -->
      <div class="flex justify-center gap-8 text-sm">
        <div class="text-center">
          <div class="font-semibold text-secondary">フォーメーション</div>
          <div class="font-mono text-lg">${e.home.formation}</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-secondary">フォーメーション</div>
          <div class="font-mono text-lg">${e.away.formation}</div>
        </div>
      </div>
    </div>
  `,t}function it(e){const t=document.createElement("div");t.className="grid grid-cols-1 lg:grid-cols-2 gap-6";const s=A(e.home,"ホーム");t.appendChild(s);const n=A(e.away,"アウェイ");return t.appendChild(n),t}function A(e,t){const s=document.createElement("div");s.className="card";const n=h(e.teamId);return s.innerHTML=`
    <div class="card-header">
      <h3 class="card-title flex items-center gap-3">
        ${f(e.teamId,32)}
        ${e.name} (${t})
      </h3>
      <div class="card-subtitle">フォーメーション: ${e.formation}</div>
    </div>
    
    <!-- チーム評価 -->
    ${e.eval?`
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-secondary mb-3">チーム評価</h4>
        <div class="grid grid-cols-3 gap-4 mb-4">
          ${e.eval.攻撃力?`
            <div class="text-center">
              <div class="text-lg font-bold" style="color: ${n.primary}">${e.eval.攻撃力}</div>
              <div class="text-xs text-muted">攻撃力</div>
            </div>
          `:""}
          ${e.eval.守備力?`
            <div class="text-center">
              <div class="text-lg font-bold" style="color: ${n.primary}">${e.eval.守備力}</div>
              <div class="text-xs text-muted">守備力</div>
            </div>
          `:""}
          ${e.eval.総合力?`
            <div class="text-center">
              <div class="text-lg font-bold" style="color: ${n.primary}">${e.eval.総合力}</div>
              <div class="text-xs text-muted">総合力</div>
            </div>
          `:""}
        </div>
        ${e.eval.寸評?`
          <div class="text-sm text-muted italic">
            「${e.eval.寸評}」
          </div>
        `:""}
      </div>
    `:""}
    
    <!-- キーポイント -->
    ${e.keychips&&e.keychips.length>0?`
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-secondary mb-3">キーポイント</h4>
        <div class="flex flex-wrap gap-2">
          ${e.keychips.map(a=>`
            <span class="inline-block px-3 py-1 text-xs font-medium bg-secondary text-inverse rounded-full">
              ${a}
            </span>
          `).join("")}
        </div>
      </div>
    `:""}
    
    <!-- 最新ニュース -->
    ${e.news&&e.news.length>0?`
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-secondary mb-3">最新ニュース</h4>
        <ul class="space-y-2">
          ${e.news.map(a=>`
            <li class="flex items-start gap-2 text-sm">
              <span class="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>${a}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    `:""}
    
    <!-- ハイライト -->
    ${e.highlights&&e.highlights.length>0?`
      <div>
        <h4 class="text-sm font-semibold text-secondary mb-3">注目ポイント</h4>
        <ul class="space-y-2">
          ${e.highlights.map(a=>`
            <li class="flex items-start gap-2 text-sm">
              <span class="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style="background-color: ${n.primary}"></span>
              <span>${a}</span>
            </li>
          `).join("")}
        </ul>
      </div>
    `:""}
  `,s}function ot(e){return e.split("-").map(t=>parseInt(t.trim(),10)).filter(t=>!isNaN(t))}function ct(e,t){const s=ot(t),n=[],a=e.find(c=>c.pos==="GK"),r=e.filter(c=>c.pos!=="GK");if(!a)throw new Error("GK not found in lineup");const i=s.reduce((c,l)=>c+l,0);if(r.length<i)throw new Error(`Not enough field players. Need ${i}, got ${r.length}`);let o=0;for(const c of s){const l=[];for(let d=0;d<c;d++)o<r.length&&(l.push(r[o]),o++);n.push(l)}return n.push([a]),n}function lt(e){const t={LB:1,LCB:2,CB:3,RCB:4,RB:5,LWB:1,RWB:5,LM:1,LCM:2,DM:3,CM:4,RCM:5,RM:6,AM:7,LW:1,LF:2,CF:3,ST:4,RF:5,RW:6,GK:1};return[...e].sort((s,n)=>{const a=t[s.pos||""]||999,r=t[n.pos||""]||999;return a===r?(s.jp||s.intl).localeCompare(n.jp||n.intl):a-r})}function dt(e){const t=[],o=e.length;return e.forEach((c,l)=>{const d=4+132*(l+.5)/o;c.forEach((v,y)=>{let m;c.length===1?m=100/2:m=4+92/(c.length+1)*(y+1),t.push({x:m,y:d})})}),t}function mt(e,t){const n=ct(e,t).map(i=>lt(i)),a=dt(n),r=[];return n.forEach(i=>{r.push(...i)}),{formation:t,lines:n,positions:a}}function M(e){return{"4-4-2":"伝統的なバランス型。攻守のバランスが良い","4-3-3":"攻撃的フォーメーション。サイドからの攻撃が特徴","3-5-2":"ウィングバック活用型。サイドの上下動が重要","4-5-1":"守備的フォーメーション。中盤で数的優位を作る","4-2-3-1":"現代的バランス型。中盤の厚みと攻撃性を両立","3-4-3":"攻撃重視。ハイプレスとポゼッションが特徴"}[e]||"カスタムフォーメーション"}async function ut(e){const t=document.createElement("div");t.className="tactics-section";const s=ht();t.appendChild(s);const n=pt(e);t.appendChild(n);const a=yt(e);t.appendChild(a);const r=bt(e);return t.appendChild(r),t}function ht(){const e=document.createElement("div");return e.className="text-center mb-8",e.innerHTML=`
    <h2 class="text-2xl font-bold mb-2">戦術分析</h2>
    <p class="text-muted">両チームの戦術的特徴と予想される展開</p>
  `,e}function pt(e){const t=document.createElement("div");t.className="card mb-8",t.innerHTML=`
    <div class="card-header">
      <h3 class="card-title">戦術比較</h3>
      <div class="card-subtitle">フォーメーションとスタイルの対比</div>
    </div>
  `;const s=vt(e);t.appendChild(s);const n=ft(e);return t.appendChild(n),t}function vt(e){const t=document.createElement("div");t.className="overflow-x-auto mb-6";const s=h(e.home.teamId),n=h(e.away.teamId);return t.innerHTML=`
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="text-left py-3 px-4" style="color: ${s.primary}">
            ${e.home.name}
          </th>
          <th class="text-center py-3 px-4 text-muted">項目</th>
          <th class="text-right py-3 px-4" style="color: ${n.primary}">
            ${e.away.name}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr>
          <td class="py-3 px-4 font-mono font-bold">${e.home.formation}</td>
          <td class="py-3 px-4 text-center text-muted">フォーメーション</td>
          <td class="py-3 px-4 text-right font-mono font-bold">${e.away.formation}</td>
        </tr>
        <tr>
          <td class="py-3 px-4">
            ${M(e.home.formation)}
          </td>
          <td class="py-3 px-4 text-center text-muted">戦術的特徴</td>
          <td class="py-3 px-4 text-right">
            ${M(e.away.formation)}
          </td>
        </tr>
        ${e.home.eval&&e.away.eval?`
          <tr>
            <td class="py-3 px-4 font-bold text-lg">${e.home.eval.攻撃力||"-"}</td>
            <td class="py-3 px-4 text-center text-muted">攻撃力</td>
            <td class="py-3 px-4 text-right font-bold text-lg">${e.away.eval.攻撃力||"-"}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-bold text-lg">${e.home.eval.守備力||"-"}</td>
            <td class="py-3 px-4 text-center text-muted">守備力</td>
            <td class="py-3 px-4 text-right font-bold text-lg">${e.away.eval.守備力||"-"}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-bold text-lg">${e.home.eval.総合力||"-"}</td>
            <td class="py-3 px-4 text-center text-muted">総合力</td>
            <td class="py-3 px-4 text-right font-bold text-lg">${e.away.eval.総合力||"-"}</td>
          </tr>
        `:""}
      </tbody>
    </table>
  `,t}function ft(e){const t=document.createElement("div");if(t.className="grid grid-cols-1 md:grid-cols-2 gap-6",e.home.eval){const s=N(e.home);t.appendChild(s)}if(e.away.eval){const s=N(e.away);t.appendChild(s)}return t}function N(e){const t=document.createElement("div");t.className="text-center";const s=h(e.teamId),n=e.eval,a=[n.攻撃力||5,n.守備力||5,n.総合力||5,7,6],r=["攻撃","守備","総合","経験","フィジカル"],i=st(a,r,120);return t.innerHTML=`
    <div class="flex items-center justify-center gap-3 mb-4">
      ${f(e.teamId,32)}
      <h4 class="font-semibold" style="color: ${s.primary}">${e.name}</h4>
    </div>
    <div class="flex justify-center mb-3">
      ${i}
    </div>
    <div class="text-xs text-muted">
      ${r.join(" • ")}
    </div>
  `,t}function yt(e){const t=document.createElement("div");t.className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8";const s=L(e.home,"ホーム");t.appendChild(s);const n=L(e.away,"アウェイ");return t.appendChild(n),t}function L(e,t){var a;const s=document.createElement("div");s.className="card";const n=h(e.teamId);return s.innerHTML=`
    <div class="card-header">
      <h3 class="card-title flex items-center gap-3">
        ${f(e.teamId,32)}
        ${e.name} 戦術分析
      </h3>
      <div class="card-subtitle">${t} / ${e.formation}</div>
    </div>
    
    <!-- 戦術的強み -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-secondary mb-3">戦術的強み</h4>
      <div class="space-y-2">
        ${xt(e).map(r=>`
          <div class="flex items-start gap-2 text-sm">
            <span class="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style="background-color: ${n.primary}"></span>
            <span>${r}</span>
          </div>
        `).join("")}
      </div>
    </div>
    
    <!-- キープレイヤーの役割 -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-secondary mb-3">キープレイヤー</h4>
      <div class="space-y-3">
        ${wt(e).map(r=>`
          <div class="flex items-start gap-3 text-sm">
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background-color: ${n.primary}">
              ${r.num}
            </div>
            <div>
              <div class="font-medium">${r.name}</div>
              <div class="text-xs text-muted">${r.role}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    
    <!-- 戦術的課題 -->
    ${(a=e.eval)!=null&&a.寸評?`
      <div>
        <h4 class="text-sm font-semibold text-secondary mb-3">分析コメント</h4>
        <p class="text-sm text-muted italic">
          「${e.eval.寸評}」
        </p>
      </div>
    `:""}
  `,s}function bt(e){const t=document.createElement("div");t.className="card",t.innerHTML=`
    <div class="card-header">
      <h3 class="card-title">予想される試合展開</h3>
      <div class="card-subtitle">戦術的分析に基づく展開予想</div>
    </div>
  `;const s=gt(e);return t.appendChild(s),t}function gt(e){const t=document.createElement("div");return t.className="space-y-4",Et(e).forEach((n,a)=>{const r=document.createElement("div");r.className="border border-border rounded-lg p-4",r.innerHTML=`
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
          ${a+1}
        </div>
        <div>
          <h4 class="font-semibold mb-2">${n.title}</h4>
          <p class="text-sm text-muted mb-2">${n.description}</p>
          <div class="text-xs text-secondary">
            確率: <span class="font-medium">${n.probability}%</span>
          </div>
        </div>
      </div>
    `,t.appendChild(r)}),t}function xt(e){return{"4-3-3":["ウィングの幅を活かした攻撃","高い位置からのプレッシング","サイドバックのオーバーラップ"],"4-2-3-1":["中盤でのボール保持","トップ下の創造性","守備的な安定感"],"3-5-2":["ウィングバックの攻撃参加","中盤での数的優位","柔軟なフォーメーション変化"]}[e.formation]||["チーム独自の戦術","バランスの取れたプレー"]}function wt(e){return(e.lineup||[]).slice(0,3).map(s=>({num:s.num||"?",name:s.jp||s.intl,role:$t(s)}))}function $t(e){return{GK:"ラストライン",CB:"ディフェンスリーダー",LB:"攻撃的サイドバック",RB:"攻撃的サイドバック",DM:"ゲームメーカー",CM:"中盤の軸",AM:"創造性の源",LW:"サイドアタッカー",RW:"サイドアタッカー",ST:"フィニッシャー"}[e.pos]||"キープレイヤー"}function Et(e){return[{title:"ポゼッション主体の展開",description:`${e.home.name}がボールを握り、じっくりと攻撃を組み立てる展開。サイドチェンジを駆使してチャンスを作る。`,probability:65},{title:"カウンター合戦",description:"両チームが激しくプレスをかけ合い、ボールの奪い合いからカウンターを狙う激しい試合展開。",probability:45},{title:"後半の選手交代が鍵",description:"前半は膠着状態が続き、後半の選手交代とフォーメーション変更が勝負の分かれ目となる。",probability:70}]}const Ct="modulepreload",kt=function(e,t){return new URL(e,t).href},I={},Tt=function(t,s,n){let a=Promise.resolve();if(s&&s.length>0){const i=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));a=Promise.allSettled(s.map(l=>{if(l=kt(l,n),l in I)return;I[l]=!0;const d=l.endsWith(".css"),v=d?'[rel="stylesheet"]':"";if(!!n)for(let b=i.length-1;b>=0;b--){const x=i[b];if(x.href===l&&(!d||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${v}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":Ct,d||(m.as="script"),m.crossOrigin="",m.href=l,c&&m.setAttribute("nonce",c),document.head.appendChild(m),d)return new Promise((b,x)=>{m.addEventListener("load",b),m.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return a.then(i=>{for(const o of i||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})};function O(e,t=5){const s=(e.jp||"").trim();if(!s)return St(e.intl||"");const n=s.split(/[\s・]/g).filter(a=>a.length>0);return n.length>1?n[0]:/\d/.test(s)||s.length<=t?s:s.length<=3?s.substring(0,1):s.substring(0,2)}function St(e){const t=(e||"").trim();if(!t)return"Unknown";const s=t.split(/\s+/).filter(n=>n.length>0);return s.length===0?"Unknown":s.length===1?s[0]:s[s.length-1]}function _(e){const t=(e.jp||"").trim(),s=(e.intl||"").trim();return t||s||"Unknown Player"}function At(e){return e.intl||"Unknown"}function Mt(e){return e.pos||"Unknown"}function Nt(e){return e.num===void 0||e.num===null?"":String(e.num)}const Lt={light:"#fdbcb4",medium:"#e8ae82",dark:"#d08b5b",tan:"#c68642"},It={black:"#2c1810",brown:"#8b4513",blonde:"#daa520",red:"#a0522d",gray:"#808080",bald:"none"};function Pt(e){var t,s,n;return{skin:((t=e.avatar)==null?void 0:t.skin)||"medium",hair:((s=e.avatar)==null?void 0:s.hair)||"brown",style:((n=e.avatar)==null?void 0:n.style)||"short",size:80}}function Rt(e){const t=e.size||80,s=Lt[e.skin||"medium"],n=It[e.hair||"brown"],a=e.style||"short",r=t/2,i=t/2,o=t*.35,c=i-t*.1,l=t*.06,d=t*.12;return`
    <svg 
      width="${t}" 
      height="${t}" 
      viewBox="0 0 ${t} ${t}" 
      xmlns="http://www.w3.org/2000/svg"
      style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe)"
    >
      <!-- 顔の輪郭 -->
      <ellipse 
        cx="${r}" 
        cy="${i}" 
        rx="${o}" 
        ry="${o*1.1}" 
        fill="${s}" 
        stroke="#d4a574" 
        stroke-width="1"
      />
      
      <!-- 髪 -->
      ${Bt(r,i,t,n,a)}
      
      <!-- 目 -->
      <ellipse 
        cx="${r-d}" 
        cy="${c}" 
        rx="${l}" 
        ry="${l*.7}" 
        fill="white"
      />
      <ellipse 
        cx="${r+d}" 
        cy="${c}" 
        rx="${l}" 
        ry="${l*.7}" 
        fill="white"
      />
      
      <!-- 瞳 -->
      <circle 
        cx="${r-d}" 
        cy="${c}" 
        r="${l*.5}" 
        fill="#2563eb"
      />
      <circle 
        cx="${r+d}" 
        cy="${c}" 
        r="${l*.5}" 
        fill="#2563eb"
      />
      
      <!-- ハイライト -->
      <circle 
        cx="${r-d-l*.2}" 
        cy="${c-l*.2}" 
        r="${l*.2}" 
        fill="white"
      />
      <circle 
        cx="${r+d-l*.2}" 
        cy="${c-l*.2}" 
        r="${l*.2}" 
        fill="white"
      />
      
      <!-- 鼻 -->
      <ellipse 
        cx="${r}" 
        cy="${i+t*.05}" 
        rx="${t*.02}" 
        ry="${t*.04}" 
        fill="${jt(s,-.1)}"
      />
      
      <!-- 口 -->
      <path 
        d="M ${r-t*.08} ${i+t*.15} 
           Q ${r} ${i+t*.18} 
           ${r+t*.08} ${i+t*.15}"
        stroke="#8b4513" 
        stroke-width="2" 
        fill="none"
        stroke-linecap="round"
      />
      
      <!-- 眉毛 -->
      <path 
        d="M ${r-d-l} ${c-t*.08} 
           L ${r-d+l} ${c-t*.06}"
        stroke="${n==="none"?"#8b4513":n}" 
        stroke-width="3" 
        stroke-linecap="round"
      />
      <path 
        d="M ${r+d-l} ${c-t*.06} 
           L ${r+d+l} ${c-t*.08}"
        stroke="${n==="none"?"#8b4513":n}" 
        stroke-width="3" 
        stroke-linecap="round"
      />
    </svg>
  `.trim()}function Bt(e,t,s,n,a){if(n==="none"||a==="bald")return"";const r=s*.35;switch(a){case"buzz":return`
        <ellipse 
          cx="${e}" 
          cy="${t-s*.05}" 
          rx="${r*.9}" 
          ry="${r*.8}" 
          fill="${n}"
        />
      `;case"curly":return`
        <ellipse 
          cx="${e}" 
          cy="${t-s*.1}" 
          rx="${r*1.1}" 
          ry="${r*.9}" 
          fill="${n}"
        />
        <circle cx="${e-r*.7}" cy="${t-s*.15}" r="${s*.08}" fill="${n}" />
        <circle cx="${e+r*.7}" cy="${t-s*.15}" r="${s*.08}" fill="${n}" />
        <circle cx="${e-r*.4}" cy="${t-s*.2}" r="${s*.06}" fill="${n}" />
        <circle cx="${e+r*.4}" cy="${t-s*.2}" r="${s*.06}" fill="${n}" />
      `;case"long":return`
        <ellipse 
          cx="${e}" 
          cy="${t-s*.08}" 
          rx="${r*1.2}" 
          ry="${r*1.1}" 
          fill="${n}"
        />
        <ellipse 
          cx="${e-r}" 
          cy="${t+s*.1}" 
          rx="${s*.15}" 
          ry="${s*.3}" 
          fill="${n}"
        />
        <ellipse 
          cx="${e+r}" 
          cy="${t+s*.1}" 
          rx="${s*.15}" 
          ry="${s*.3}" 
          fill="${n}"
        />
      `;case"short":default:return`
        <ellipse 
          cx="${e}" 
          cy="${t-s*.08}" 
          rx="${r}" 
          ry="${r*.85}" 
          fill="${n}"
        />
      `}}function jt(e,t){const s=e.replace("#",""),n=parseInt(s.substr(0,2),16),a=parseInt(s.substr(2,2),16),r=parseInt(s.substr(4,2),16),i=Math.max(0,Math.min(255,n+n*t)),o=Math.max(0,Math.min(255,a+a*t)),c=Math.max(0,Math.min(255,r+r*t)),l=d=>Math.round(d).toString(16).padStart(2,"0");return`#${l(i)}${l(o)}${l(c)}`}function Ht(e){let t=0;for(let r=0;r<e.length;r++){const i=e.charCodeAt(r);t=(t<<5)-t+i,t=t&t}const s=["light","medium","dark","tan"],n=["black","brown","blonde","red","gray"],a=["short","buzz","curly","long"];return{skin:s[Math.abs(t)%s.length],hair:n[Math.abs(t>>8)%n.length],style:a[Math.abs(t>>16)%a.length]}}function Ft(e){return`data:image/svg+xml;base64,${btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g,(s,n)=>String.fromCharCode(parseInt(n,16))))}`}function Dt(e,t=80){if(e.photoUrl)return e.photoUrl;const s={...Pt(e),size:t};return Ft(Rt(s))}class Ot{constructor(){p(this,"modalElement",null);p(this,"backdropElement",null);p(this,"isModalOpen",!1);p(this,"focusBeforeModal",null);this.handleKeydown=this.handleKeydown.bind(this),this.handleBackdropClick=this.handleBackdropClick.bind(this)}open(t){this.isModalOpen&&this.close(),this.focusBeforeModal=document.activeElement,this.createModal(t),document.body.appendChild(this.backdropElement),document.addEventListener("keydown",this.handleKeydown),this.backdropElement.addEventListener("click",this.handleBackdropClick),document.body.style.overflow="hidden",this.isModalOpen=!0,setTimeout(()=>{const s=this.modalElement.querySelector(".modal-close");s==null||s.focus()},100)}close(){this.isModalOpen&&(document.removeEventListener("keydown",this.handleKeydown),this.backdropElement&&this.backdropElement.remove(),document.body.style.overflow="",this.focusBeforeModal&&this.focusBeforeModal.focus(),this.isModalOpen=!1,this.modalElement=null,this.backdropElement=null,this.focusBeforeModal=null)}isOpen(){return this.isModalOpen}createModal(t){this.backdropElement=document.createElement("div"),this.backdropElement.className="modal-backdrop",this.backdropElement.setAttribute("role","dialog"),this.backdropElement.setAttribute("aria-modal","true"),this.backdropElement.setAttribute("aria-labelledby","modal-title"),this.modalElement=document.createElement("div"),this.modalElement.className="modal",this.modalElement.innerHTML=this.generateModalContent(t),this.backdropElement.appendChild(this.modalElement);const s=this.modalElement.querySelector(".modal-close");s==null||s.addEventListener("click",()=>this.close())}generateModalContent(t){const s=_(t),n=At(t),a=Mt(t),r=Nt(t),i=Dt(t,80);return`
      <div class="modal-header">
        <h2 id="modal-title" class="modal-title">${s}</h2>
        <button class="modal-close" aria-label="閉じる">×</button>
      </div>
      
      <div class="modal-body">
        <!-- プレイヤー情報 -->
        <div class="modal-section">
          <div class="player-info">
            <img src="${i}" alt="${s}のアバター" class="player-avatar" />
            <h3 class="player-name">${s}</h3>
            <div class="player-details">
              <span><strong>英名:</strong> ${n}</span>
              <span><strong>ポジション:</strong> ${a}</span>
              ${r?`<span><strong>背番号:</strong> ${r}</span>`:""}
            </div>
          </div>
        </div>

        <!-- 今季スタッツ -->
        ${this.generateStatsSection(t)}
        
        <!-- 詳細情報 -->
        ${this.generateDetailsSection(t)}
      </div>
    `}generateStatsSection(t){if(!t.stats)return`
        <div class="modal-section">
          <h4>今季スタッツ</h4>
          <p class="text-muted">データなし</p>
        </div>
      `;const{apps:s=0,goals:n=0,assists:a=0,cleanSheets:r,saves:i}=t.stats;return t.pos==="GK"?`
        <div class="modal-section">
          <h4>今季スタッツ</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${s}</div>
              <div class="stat-label">出場</div>
            </div>
            ${r!==void 0?`
              <div class="stat-item">
                <div class="stat-value">${r}</div>
                <div class="stat-label">CS</div>
              </div>
            `:""}
            ${i!==void 0?`
              <div class="stat-item">
                <div class="stat-value">${i}</div>
                <div class="stat-label">セーブ</div>
              </div>
            `:""}
          </div>
        </div>
      `:`
      <div class="modal-section">
        <h4>今季スタッツ</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${s}</div>
            <div class="stat-label">出場</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${n}</div>
            <div class="stat-label">ゴール</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${a}</div>
            <div class="stat-label">アシスト</div>
          </div>
        </div>
      </div>
    `}generateDetailsSection(t){const s=[];if(t.avatar){const{skin:n,hair:a,style:r}=t.avatar;s.push(`外見: ${this.translateAvatarFeature("skin",n)} / ${this.translateAvatarFeature("hair",a)} / ${this.translateAvatarFeature("style",r)}`)}return t.playerId&&s.push(`ID: ${t.playerId}`),s.length===0?"":`
      <div class="modal-section">
        <h4>詳細情報</h4>
        <ul class="list-unstyled">
          ${s.map(n=>`<li class="text-sm text-muted">${n}</li>`).join("")}
        </ul>
      </div>
    `}translateAvatarFeature(t,s){var a;return s?((a={skin:{light:"明るい肌",medium:"普通の肌",dark:"濃い肌",tan:"日焼けした肌"},hair:{black:"黒髪",brown:"茶髪",blonde:"金髪",red:"赤毛",gray:"白髪",bald:"ハゲ"},style:{short:"ショート",buzz:"坊主",curly:"カーリー",long:"ロング",bald:"ハゲ"}}[t])==null?void 0:a[s])||s:"不明"}handleKeydown(t){t.key==="Escape"&&(t.preventDefault(),this.close()),t.key==="Tab"&&this.modalElement&&this.trapFocus(t)}handleBackdropClick(t){t.target===this.backdropElement&&this.close()}trapFocus(t){if(!this.modalElement)return;const s=this.modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),n=s[0],a=s[s.length-1];t.shiftKey?document.activeElement===n&&(t.preventDefault(),a.focus()):document.activeElement===a&&(t.preventDefault(),n.focus())}}const P=new Ot;function K(e,t){e.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),P.open(t)}),e.setAttribute("role","button"),e.setAttribute("tabindex","0"),e.setAttribute("aria-label",`${_(t)}の詳細を表示`),e.addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),P.open(t))})}function _t(e,t,s=""){let n;try{n=mt(t,e)}catch(c){console.error("Formation analysis failed:",c),n=Wt(t)}const a=document.createElement("div");a.className="pitch-container";const r=document.createElement("div");r.className="pitch-box";const i=Kt();return r.appendChild(i),Gt(n,s).forEach(c=>r.appendChild(c)),a.appendChild(r),a}function Kt(){const e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttribute("class","pitch-svg"),e.setAttribute("viewBox","0 0 100 140"),e.setAttribute("preserveAspectRatio","xMidYMid meet");const t=document.createElementNS("http://www.w3.org/2000/svg","g");t.setAttribute("class","pitch-lines");const s=document.createElementNS("http://www.w3.org/2000/svg","rect");s.setAttribute("x","4"),s.setAttribute("y","4"),s.setAttribute("width","92"),s.setAttribute("height","132"),s.setAttribute("fill","none"),s.setAttribute("stroke","currentColor"),s.setAttribute("stroke-width","1"),t.appendChild(s);const n=document.createElementNS("http://www.w3.org/2000/svg","line");n.setAttribute("x1","4"),n.setAttribute("y1","70"),n.setAttribute("x2","96"),n.setAttribute("y2","70"),n.setAttribute("stroke","currentColor"),n.setAttribute("stroke-width","1"),t.appendChild(n);const a=document.createElementNS("http://www.w3.org/2000/svg","circle");a.setAttribute("cx","50"),a.setAttribute("cy","70"),a.setAttribute("r","10"),a.setAttribute("fill","none"),a.setAttribute("stroke","currentColor"),a.setAttribute("stroke-width","1"),t.appendChild(a);const r=document.createElementNS("http://www.w3.org/2000/svg","rect");r.setAttribute("x","20"),r.setAttribute("y","4"),r.setAttribute("width","60"),r.setAttribute("height","18"),r.setAttribute("fill","none"),r.setAttribute("stroke","currentColor"),r.setAttribute("stroke-width","1"),t.appendChild(r);const i=document.createElementNS("http://www.w3.org/2000/svg","rect");i.setAttribute("x","20"),i.setAttribute("y","118"),i.setAttribute("width","60"),i.setAttribute("height","18"),i.setAttribute("fill","none"),i.setAttribute("stroke","currentColor"),i.setAttribute("stroke-width","1"),t.appendChild(i);const o=document.createElementNS("http://www.w3.org/2000/svg","rect");o.setAttribute("x","35"),o.setAttribute("y","4"),o.setAttribute("width","30"),o.setAttribute("height","8"),o.setAttribute("fill","none"),o.setAttribute("stroke","currentColor"),o.setAttribute("stroke-width","1"),t.appendChild(o);const c=document.createElementNS("http://www.w3.org/2000/svg","rect");return c.setAttribute("x","35"),c.setAttribute("y","128"),c.setAttribute("width","30"),c.setAttribute("height","8"),c.setAttribute("fill","none"),c.setAttribute("stroke","currentColor"),c.setAttribute("stroke-width","1"),t.appendChild(c),e.appendChild(t),e}function Gt(e,t){const s=[],n=h(t),a=[];return e.lines.forEach(r=>{a.push(...r)}),a.forEach((r,i)=>{const o=e.positions[i];if(!o)return;const c=Ut(r,o,n.cssClass);s.push(c)}),s}function Ut(e,t,s){const n=document.createElement("div");n.className=`pnode ${s}`,n.style.left=`${t.x}%`,n.style.top=`${t.y}%`,n.style.transform="translate(-50%, -50%)";const a=document.createElement("div");a.className="dot",n.appendChild(a);const r=document.createElement("div");if(r.className="namebox",r.textContent=O(e),n.appendChild(r),e.pos){const i=document.createElement("div");i.className="pos",i.textContent=e.pos,n.appendChild(i)}return K(n,e),n}function Wt(e){const t=e.find(r=>r.pos==="GK")||e[0],s=e.filter(r=>r!==t).slice(0,10),n=[s.slice(0,4),s.slice(4,8),s.slice(8,10),[t]],a=[];return n[0].forEach((r,i)=>{a.push({x:15+i*70/3,y:25})}),n[1].forEach((r,i)=>{a.push({x:15+i*70/3,y:50})}),n[2].forEach((r,i)=>{a.push({x:30+i*40,y:75})}),a.push({x:50,y:10}),{formation:"フォールバック",lines:n,positions:a}}function qt(e,t,s){return e.map(n=>typeof n=="string"?Vt(n,t,s):n)}function Vt(e,t,s){const n=e.trim(),a=(t==null?void 0:t[n])||n,r=Jt(n),i=(s==null?void 0:s[n])||Ht(n);return{jp:a,intl:n,pos:r,avatar:i,stats:{apps:0,goals:0,assists:0}}}function Jt(e){const t=e.toLowerCase();if(t.includes("keeper")||t.includes("ramsdale")||t.includes("meslier")||t.includes("leno")||t.includes("turner"))return"GK";const n={"aaron ramsdale":"GK","takehiro tomiyasu":"RB","jakub kiwior":"CB","kieran tierney":"LB",jorginho:"CM","fabio vieira":"AM","leandro trossard":"LW","gabriel jesus":"ST","eddie nketiah":"ST","emile smith rowe":"AM","mohamed elneny":"CM","sam byram":"RB","archie gray":"CM","charlie cresswell":"CB","wilfried gnonto":"LW","joel piroe":"ST","georginio rutter":"AM","mateo joseph":"ST","max wober":"CB","tyler adams":"DM"}[t];return n||(t.includes("son")||t.includes("joseph")?"ST":t.includes("gray")||t.includes("smith")?"CM":"SUB")}function Qt(e){const t={GK:1,CB:2,LB:3,RB:4,DM:5,CM:6,AM:7,LW:8,RW:9,ST:10,SUB:11};return[...e].sort((s,n)=>{const a=t[s.pos||"SUB"]||999,r=t[n.pos||"SUB"]||999;return a===r?(s.jp||s.intl).localeCompare(n.jp||n.intl):a-r})}function zt(e){if(e.stats&&Object.keys(e.stats).length>0)return e;let t={apps:0,goals:0,assists:0};switch(e.pos){case"GK":t={apps:10,goals:0,assists:0};break;case"CB":case"LB":case"RB":t={apps:15,goals:1,assists:2};break;case"DM":case"CM":t={apps:20,goals:2,assists:3};break;case"AM":case"LW":case"RW":t={apps:18,goals:4,assists:6};break;case"ST":t={apps:16,goals:6,assists:2};break;default:t={apps:8,goals:1,assists:1}}return{...e,stats:t}}async function Zt(){try{const[e,t]=await Promise.all([fetch("/src/data/overrides/jp-name-overrides.json"),fetch("/src/data/overrides/avatar-guess.json")]),s=await e.json(),n=await t.json();return{nameOverrides:s,avatarGuess:n}}catch(e){return console.warn("Failed to load overrides:",e),{nameOverrides:{},avatarGuess:{}}}}async function Yt(e){const{nameOverrides:t,avatarGuess:s}=await Zt(),a=qt(e,t,s).map(r=>zt(r));return Qt(a)}async function Xt(e,t){const s=document.createElement("div");s.className="lineup-section";const n=te(e,t);s.appendChild(n);const a=t==="home"?e.home:e.away,r=ee(a);s.appendChild(r);const i=_t(a.formation,a.lineup,a.teamId);s.appendChild(i);const o=await se(a);return s.appendChild(o),s}function te(e,t){const s=document.createElement("div");s.className="mb-6";const n=document.createElement("div");n.className="flex items-center justify-between mb-4";const a=document.createElement("h2");a.className="text-lg font-semibold",a.textContent="予想スタメン";const r=document.createElement("div");r.className="team-pills";const i=R(e.home,"home",t==="home");r.appendChild(i);const o=R(e.away,"away",t==="away");return r.appendChild(o),n.appendChild(a),n.appendChild(r),s.appendChild(n),s}function R(e,t,s){const n=document.createElement("button");return n.className=`team-pill ${e.teamId} ${s?"active":""}`,n.setAttribute("data-team",t),n.innerHTML=`
    ${f(e.teamId,20)}
    <span class="ml-2">${e.name}</span>
  `,n.addEventListener("click",()=>{Tt(async()=>{const{setActiveTeam:a}=await Promise.resolve().then(()=>V);return{setActiveTeam:a}},void 0,import.meta.url).then(({setActiveTeam:a})=>{a(t)})}),n}function ee(e){const t=document.createElement("div");t.className="text-center mb-6";const s=h(e.teamId);return t.innerHTML=`
    <div class="flex items-center justify-center gap-4 mb-2">
      ${f(e.teamId,40)}
      <div>
        <h3 class="text-xl font-bold" style="color: ${s.primary}">${e.name}</h3>
        <div class="text-sm text-muted">フォーメーション: ${e.formation}</div>
      </div>
    </div>
  `,t}async function se(e){const t=document.createElement("div");t.className="bench-area";const s=document.createElement("h3");s.className="bench-title",s.textContent="ベンチメンバー",t.appendChild(s);try{const n=await Yt(e.bench);if(n.length===0){const r=document.createElement("div");return r.className="text-center py-8 text-muted",r.textContent="ベンチメンバーの情報がありません",t.appendChild(r),t}const a=document.createElement("div");a.className="bench-grid",n.forEach(r=>{const i=ne(r,e.teamId);a.appendChild(i)}),t.appendChild(a)}catch(n){console.error("Failed to create bench section:",n);const a=document.createElement("div");a.className="text-center py-8 text-error",a.textContent="ベンチメンバーの読み込みに失敗しました",t.appendChild(a)}return t}function ne(e,t){const s=document.createElement("div");s.className="bench-player cursor-pointer";const n=h(t),a=document.createElement("div");a.className="dot",a.style.backgroundColor=n.primary,a.style.borderColor=n.secondary;const r=document.createElement("div");r.className="namebox",r.textContent=O(e);const i=document.createElement("div");if(i.className="text-xs text-muted mt-1",i.textContent=e.pos||"SUB",e.num){const o=document.createElement("div");o.className="text-xs font-mono text-muted",o.textContent=`#${e.num}`,s.appendChild(o)}return s.appendChild(a),s.appendChild(r),s.appendChild(i),K(s,e),s}async function ae(e){const t=document.createElement("div");t.className="timeline-section";const s=re();t.appendChild(s);const n=ie(e);t.appendChild(n);const a=oe(e);t.appendChild(a);const r=ue(e);return t.appendChild(r),t}function re(){const e=document.createElement("div");return e.className="text-center mb-8",e.innerHTML=`
    <h2 class="text-2xl font-bold mb-2">試合の流れ</h2>
    <p class="text-muted">タイムラインとキーポイントで振り返る</p>
  `,e}function ie(e){const t=document.createElement("div");if(t.className="card mb-8",t.innerHTML=`
    <div class="card-header">
      <h3 class="card-title">試合のキーポイント</h3>
      <div class="card-subtitle">注目すべき要素と展開</div>
    </div>
  `,e.keyPoints&&e.keyPoints.length>0){const s=document.createElement("div");s.className="grid grid-cols-1 md:grid-cols-2 gap-4",e.keyPoints.forEach((n,a)=>{const r=document.createElement("div");r.className="flex items-start gap-3 p-4 bg-tertiary rounded-lg",r.innerHTML=`
        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
          ${a+1}
        </div>
        <div class="text-sm">
          ${n}
        </div>
      `,s.appendChild(r)}),t.appendChild(s)}else{const s=document.createElement("div");s.className="text-center py-8 text-muted",s.textContent="キーポイント情報はありません",t.appendChild(s)}return t}function oe(e){const t=document.createElement("div");if(t.className="card mb-8",t.innerHTML=`
    <div class="card-header">
      <h3 class="card-title">試合タイムライン</h3>
      <div class="card-subtitle">時系列で見る試合展開</div>
    </div>
  `,e.timeline&&e.timeline.length>0){const s=ce(e.timeline,e);t.appendChild(s)}else{const s=document.createElement("div");s.className="text-center py-8 text-muted",s.textContent="タイムライン情報はありません",t.appendChild(s)}return t}function ce(e,t){const s=document.createElement("div");s.className="relative";const n=document.createElement("div");n.className="absolute left-8 top-0 bottom-0 w-0.5 bg-border",s.appendChild(n);const a=document.createElement("div");return a.className="space-y-6",e.forEach(r=>{const i=le(r,t);a.appendChild(i)}),s.appendChild(a),s}function le(e,t){const s=document.createElement("div");s.className="relative flex items-start gap-4";const n=de(e),a=document.createElement("div");a.className="flex-1 min-w-0";let r="var(--color-primary)";return e.team==="home"?r=h(t.home.teamId).primary:e.team==="away"&&(r=h(t.away.teamId).primary),a.innerHTML=`
    <div class="flex items-center gap-3 mb-2">
      <div class="text-sm font-mono font-bold text-secondary">${e.time}</div>
      <div class="px-2 py-1 text-xs rounded-full bg-tertiary text-secondary">
        ${ve(e.phase)}
      </div>
      ${e.type?`
        <div class="px-2 py-1 text-xs rounded-full text-white" style="background-color: ${ye(e.type)}">
          ${fe(e.type)}
        </div>
      `:""}
    </div>
    
    <div class="text-sm mb-1" ${e.team?`style="color: ${r}"`:""}>
      ${e.desc}
    </div>
    
    ${e.player?`
      <div class="text-xs text-muted">
        関連選手: <span class="font-medium">${e.player}</span>
      </div>
    `:""}
  `,s.appendChild(n),s.appendChild(a),s}function de(e){const t=document.createElement("div");t.className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold z-10";const{color:s,symbol:n}=me(e);return t.style.backgroundColor=s,t.textContent=n,t}function me(e){if(e.type){const s={goal:{color:"#10b981",symbol:"⚽"},assist:{color:"#3b82f6",symbol:"🅰"},card:{color:"#f59e0b",symbol:"📋"},substitution:{color:"#8b5cf6",symbol:"🔄"},other:{color:"#6b7280",symbol:"ℹ"}};return s[e.type]||s.other}return{開始:{color:"#10b981",symbol:"▶"},前半:{color:"#3b82f6",symbol:"1"},後半:{color:"#f59e0b",symbol:"2"},延長前半:{color:"#ef4444",symbol:"E1"},延長後半:{color:"#ef4444",symbol:"E2"},PK戦:{color:"#8b5cf6",symbol:"PK"},終了:{color:"#6b7280",symbol:"■"}}[e.phase]||{color:"#6b7280",symbol:"●"}}function ue(e){const t=document.createElement("div");t.className="card",t.innerHTML=`
    <div class="card-header">
      <h3 class="card-title">試合統計</h3>
      <div class="card-subtitle">タイムライン分析</div>
    </div>
  `;const s=pe(e.timeline),n=he(s);return t.appendChild(n),t}function he(e){const t=document.createElement("div");return t.className="grid grid-cols-2 md:grid-cols-4 gap-4",[{label:"総イベント数",value:e.totalEvents},{label:"ゴール",value:e.goals},{label:"交代",value:e.substitutions},{label:"カード",value:e.cards}].forEach(n=>{const a=document.createElement("div");a.className="text-center p-4 bg-secondary rounded-lg",a.innerHTML=`
      <div class="text-2xl font-bold mb-1">${n.value}</div>
      <div class="text-sm text-muted">${n.label}</div>
    `,t.appendChild(a)}),t}function pe(e){const t={totalEvents:e.length,goals:0,substitutions:0,cards:0,phases:{}};return e.forEach(s=>{t.phases[s.phase]=(t.phases[s.phase]||0)+1,s.type==="goal"&&t.goals++,s.type==="substitution"&&t.substitutions++,s.type==="card"&&t.cards++}),t}function ve(e){return{開始:"キックオフ",前半:"前半",後半:"後半",延長前半:"延長前半",延長後半:"延長後半",PK戦:"PK戦",終了:"試合終了"}[e]||e}function fe(e){return{goal:"ゴール",assist:"アシスト",card:"カード",substitution:"交代",other:"その他"}[e]||e}function ye(e){return{goal:"#10b981",assist:"#3b82f6",card:"#f59e0b",substitution:"#8b5cf6",other:"#6b7280"}[e]||"#6b7280"}async function B(){try{F(),C(!0),Y(),await be(),await ge();const e=await we();j(e),await $(),$e(),C(!1)}catch(e){console.error("App initialization failed:",e),E(e instanceof Error?e.message:"初期化に失敗しました")}}async function be(){const e=document.createElement("header");e.className="header";const t=document.createElement("div");t.className="container header-content";const s=document.createElement("a");s.className="logo",s.href="#overview",s.textContent="試合プレビュー";const n=xe();t.appendChild(s),t.appendChild(n),e.appendChild(t);const a=document.querySelector("header");a?a.replaceWith(e):document.body.insertBefore(e,document.body.firstChild)}async function ge(){const e=document.createElement("nav");e.className="container";const t=document.createElement("div");t.className="tab-nav",z().forEach(({route:a,title:r,hash:i})=>{const o=document.createElement("button");o.className="tab-button",o.textContent=r,o.setAttribute("data-route",a),o.addEventListener("click",()=>{window.location.hash=i}),t.appendChild(o)}),e.appendChild(t);const n=document.querySelector("header");n?n.insertAdjacentElement("afterend",e):document.body.appendChild(e),k()}function xe(){const e=document.createElement("button");e.className="btn btn-secondary",e.setAttribute("aria-label","テーマ切り替え");const t=document.createElement("span");return t.textContent="🌙",e.appendChild(t),e.addEventListener("click",()=>{const n=u.getState().theme;let a;n==="light"?(a="dark",t.textContent="☀️"):n==="dark"?(a="auto",t.textContent="🌗"):(a="light",t.textContent="🌙"),u.setTheme(a)}),e}async function we(){try{const e=await fetch("./data/fixtures/2025-08-24-ars-lee.json");if(!e.ok)throw new Error(`Failed to load fixture data: ${e.status}`);return await e.json()}catch(e){throw console.error("Failed to load fixture data:",e),new Error("試合データの読み込みに失敗しました")}}async function $(){const e=u.getState(),t=e.selectedTab;let s=document.querySelector("main");if(s||(s=document.createElement("main"),s.className="container",document.body.appendChild(s)),e.loading){s.innerHTML=`
      <div class="flex items-center justify-center py-16">
        <div class="text-lg text-muted">読み込み中...</div>
      </div>
    `;return}if(e.error){s.innerHTML=`
      <div class="card">
        <div class="text-center py-8">
          <h2 class="text-xl font-semibold mb-4 text-error">エラーが発生しました</h2>
          <p class="text-muted mb-6">${e.error}</p>
          <button class="btn btn-primary" onclick="location.reload()">
            再読み込み
          </button>
        </div>
      </div>
    `;return}if(!e.currentFixture){s.innerHTML=`
      <div class="card">
        <div class="text-center py-8">
          <h2 class="text-xl font-semibold mb-4">試合データが見つかりません</h2>
          <p class="text-muted">試合情報を読み込めませんでした。</p>
        </div>
      </div>
    `;return}try{let n;switch(t){case"overview":n=await nt(e.currentFixture);break;case"tactics":n=await ut(e.currentFixture);break;case"lineup":n=await Xt(e.currentFixture,e.selectedTeam);break;case"timeline":n=await ae(e.currentFixture);break;default:throw new Error(`Unknown route: ${t}`)}s.innerHTML="",s.appendChild(n)}catch(n){console.error("Failed to render route:",n),s.innerHTML=`
      <div class="card">
        <div class="text-center py-8">
          <h2 class="text-xl font-semibold mb-4 text-error">描画エラー</h2>
          <p class="text-muted">コンテンツの描画に失敗しました。</p>
        </div>
      </div>
    `}}function k(){const e=u.getState();document.querySelectorAll(".tab-button").forEach(s=>{s.getAttribute("data-route")===e.selectedTab?s.classList.add("active"):s.classList.remove("active")})}function $e(){T(()=>{k(),$()}),Q(()=>{k(),$()});let e;window.addEventListener("resize",()=>{clearTimeout(e),e=window.setTimeout(()=>{$()},250)}),document.addEventListener("keydown",t=>{(t.ctrlKey||t.metaKey)&&t.key==="r"&&(t.preventDefault(),location.reload())})}function Ee(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",B):B()}window.addEventListener("error",e=>{console.error("Unhandled error:",e.error),E("予期しないエラーが発生しました")});window.addEventListener("unhandledrejection",e=>{console.error("Unhandled promise rejection:",e.reason),E("非同期処理でエラーが発生しました")});Ee();
//# sourceMappingURL=index-Cnj_b5vU.js.map
