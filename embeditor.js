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

        this._root=root;
        this._gutter=gutter;
        this._pre=pre;
        this._code=code;
        this._textarea=textarea;

        this._onInput=()=>{
            this._updateGutter();
            this._updateMirror();
            if(this._onChange)this._onChange(this.getValue());
        }
        this._onScroll=()=>{
            this._gutter.scrollTop=this._textarea.scrollTop;
            this._pre.scrollTop=this._textarea.scrollTop;
            this._pre.scrollLeft=this._textarea.scrollLeft;
        }
        this._onKeydown=(e)=>{
            if(e.key==="Tab"&&!this._textarea.readOnly){
                e.preventDefault();
                const unit=options.tabSize?new Array(options.tabSize+1).join(" "):"  ";
                const start=this._textarea.selectionStart;
                const end=this._textarea.selectionEnd;
                this._textarea.value=this._textarea.value.slice(0,start)+unit+this._textarea.value.slice(end);
                this._textarea.selectionStart=this._textarea.selectionEnd=start+unit.length;
                this._onInput();
            }
        }

        textarea.addEventListener("input",this._onInput);
        textarea.addEventListener("scroll",this._onScroll);
        textarea.addEventListener("keydown",this._onKeydown);

        this._updateGutter;
        this._updateMirror;
    }

    _updateGutter(){
        const lines=this._textarea.value.split("\n").length;
        let out="";
        for(let i=0;i<lines;i++)out+=i+"\n";
        this._gutter.textContent=out;
    }

    _updateMirror(){
        this._code.textContent=this._textarea.value+"\n";
    }

    getValue(){
        return this._textarea.value;
    }

    setValue(value){
        this._textarea.value=value||"";
        this._updateGutter();
        this._updateMirror();
        return this;
    }

    setReadonly(flag){
        if(flag)this._textarea.setAttribute("readonly","readonly");
        else this._textarea.removeAttribute("readonly");
        return this;
    }

    setFontSize(){
        this._root.style.setProperty("--eme-font-size",px+"px");
        this._root.style.setProperty("--eme-line-height",Math.round(px*1.7)+"px");
        return this;
    }
}