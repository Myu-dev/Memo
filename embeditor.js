class Embeditor{
    constructor(container,options={}){
        if(!(container instanceof Element))throw new Error("Editor: first argument must be a Dom element");
        this._container=container;
        this._onChange=typeof options._onChange==="function"?options._onChange:null;

        const root=document.createElement("div");
        root.className="eme-root";
        
        const gutter=document.createElement("div");
        gutter.className="eme-gutter";
        gutter.textContent='1';
        if(options.lineNumbers===false)gutter.style.display="none";

        const wrap=document.createElement("div");
        wrap.className="eme-editor-wrap";
        
        const pre=document.createElement("pre");
        const code=document.createElement("code");
        pre.appendChild(code);

        const textarea=document.createElement("textarea");
        textarea.className="eme-textarea";
        textarea.spellcheck=false;
        textarea.autocapitalize="off";
        textarea.setAttribute("autocomplete","off");
        textarea.value=options.value||"";
        if(options.placeholder)textarea.placeholder=options.placeholder;
        if(options.readOnly)textarea.setAttribute("readonly","readonly");

        wrap.appendChild(pre);
        wrap.appendChild(textarea);
        
        root.appendChild(gutter);
        root.appendChild(wrap);
        container.appendChild(root);
    }
}