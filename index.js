'use strict';
export class SynapsClient {
    constructor(session_id, service) {
        this.workflow_type = 'modal'
        this.service = service
        this.base_url = 'https://verify.synaps.io';
        this.styles = "@import url(https://fonts.googleapis.com/css?family=Rubik&display=swap);.synaps-verify-btn-blue{outline:0;cursor:pointer;background:#2b415f;padding:13px;color:#fff;font-size:1.05rem;font-family:Rubik,sans-serif;border-radius:4px;border:1px solid #2b415f;padding-left:40px;background-image:url(https://s3-eu-west-1.amazonaws.com/synaps-cdn/synaps-logo-white.svg);background-size:16px;background-repeat:no-repeat;background-position:12px center}.synaps-verify-btn-blue:focus,.synaps-verify-btn-blue:hover{color:#fff;outline:0;background-color:#1d3349;border:1px solid #1d3349;-webkit-transform:translateY(-1px);transform:translateY(-1px)}.synaps-verify-btn-blue:active{color:#e6ebf1;background-color:#1d3349;-webkit-transform:translateY(1px);transform:translateY(1px);outline:0}.synaps-verify-btn-white{outline:0;cursor:pointer;background:#fff;padding:13px;color:#2b415f;font-size:1.05rem;font-family:Rubik,sans-serif;border-radius:4px;border:1px solid #f2f2f2;padding-left:40px;background-image:url(https://s3-eu-west-1.amazonaws.com/synaps-cdn/synaps-logo-blue.svg);background-size:16px;background-repeat:no-repeat;background-position:12px center}.synaps-verify-btn-white:focus,.synaps-verify-btn-white:hover{color:#365069;outline:0;background-color:#f9f9f9;border:1px solid #ddd;-webkit-transform:translateY(-1px);transform:translateY(-1px)}.synaps-verify-btn-white:active{color:#365069;background-color:#fff;-webkit-transform:translateY(1px);transform:translateY(1px);outline:0}.synaps-container{width:100%;height:100%;border-color:transparent;border-width:0;border-style:none;left:0;top:0;-webkit-tap-highlight-color:transparent}@media(max-width:700px){.synaps-container{width:98%}}";
        this.session_id = session_id;
        this.is_open = false;
        this.colors = {
            primary: '',
            secondary: '',
        }
        this.iframe = document.createElement('iframe');
        this.user_close_callback = null;
        this.user_finish_callback = null;
        this.initStyle()
    }

    initModal(id) {
        let _this = this;
        document.addEventListener(
            'click',
            function (event) {
                var element = event.target;
                if (
                    (element.tagName === 'BUTTON' || element.tagName === 'A') &&
                    element.attributes.id
                ) {
                    if (
                        element.attributes.id.value === id &&
                        _this.is_open === false
                    ) {
                        _this.openSession();
                    }
                }
            }
        );
    }

    initEmbed(id) {
        let self = this
        setTimeout(function () {
            let embeddedWorkflow = self.getWorkflow();
            let embedElement = document.getElementById(id);
            if (embedElement !== null) {
                self.is_open = true;
                embeddedWorkflow.setAttribute('class', 'synaps-container');
                embedElement.appendChild(embeddedWorkflow);
            }
        }, 1000)
    }

    on(type, callback) {
        if (type === 'close') {
            this.user_close_callback = callback;
        }
        if (type === 'finish') {
            this.user_finish_callback = callback;
        }
    }

    init(options = {
        element_id: '',
        type: 'modal',
        colors: {
            primary: '',
            secondary: ''
        }
    }) {
        if (!options.type) {
            options.type = 'modal'
        }
        if (!options.colors) {
            options.colors = {
                primary: '',
                secondary: ''
            }
        }
        if (!options.element_id) {
            options.element_id = ''
        }
        if (options.type === 'modal' || options.type === 'embed') {
            this.colors = options.colors;
            if (options.element_id === '') {
                if (options.type === 'modal') {
                    options.element_id = 'synaps-btn'
                }
                else if (options.type === 'embed') {
                    options.element_id = 'synaps-embed'
                }
            }
            this.workflow_type = options.type
            this.initEvents();
            if (this.workflow_type === 'embed' && options.element_id !== '') {
                this.initEmbed(options.element_id);
            }

            if (this.workflow_type === 'modal' && options.element_id !== '') {
                this.initModal(options.element_id);
            }
        }
    }

    initStyle() {
        let styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = this.styles;
        document.head.appendChild(styleSheet);
    }

    initEvents() {
        const _this = this;
        window.addEventListener(
            'message',
            function (e) {
                if (e.data.type && e.data.type === 'close') {
                    if (_this.workflow_type === 'modal') {
                        _this.closeWorkflow();
                        if (typeof _this.user_close_callback === 'function') {
                            _this.user_close_callback();
                        }
                    }
                }
                if (e.data.type && e.data.type === 'finish') {
                    if (_this.workflow_type === 'modal') {
                        _this.closeWorkflow();
                    }
                    if (typeof _this.user_finish_callback === 'function') {
                        _this.user_finish_callback();
                    }
                }
            }
        );
    }

    openSession() {
        if (this.is_open === true) {
            return;
        }
        this.is_open = true;
        let html = document.getElementsByTagName('html')[0];
        let src = `${this.base_url}?session_id=${this.session_id}&service=${this.service}&type=${this.workflow_type}&primary_color=${this.colors.primary}&secondary_color=${this.colors.secondary}`;
        html.style.overflow = 'hidden';
        html.style.overflow = 'hidden';
        this.iframe.setAttribute('src', src);
        this.iframe.setAttribute('allow', 'microphone; camera; midi; encrypted-media;');
        this.iframe.setAttribute('allowtransparency', 'true');
        this.iframe.setAttribute('frameborder', 'none');
        this.iframe.setAttribute('border', '0');
        this.iframe.setAttribute('resize', 'none');
        this.iframe.setAttribute('style', 'z-index: 99999999; overflow: hidden auto; visibility: visible; margin: 0px; padding: 0px; position: fixed; border-color: transparent; border-width: 0; border-style: none; left: 0px; top: 0px; width: 100%; height: 100%; -webkit-tap-highlight-color: transparent;');
        document.body.appendChild(this.iframe);
    }

    getWorkflow() {
        let src = `${this.base_url}?session_id=${this.session_id}&service=${this.service}&type=${this.workflow_type}&primary_color=${this.colors.primary}&secondary_color=${this.colors.secondary}`;
        this.iframe.setAttribute('src', src);
        this.iframe.setAttribute('allow', 'microphone; camera; midi; encrypted-media;');
        this.iframe.setAttribute('allowtransparency', 'true');
        this.iframe.setAttribute('frameborder', 'none');
        this.iframe.setAttribute('border', '0');
        this.iframe.setAttribute('resize', 'none');
        return this.iframe;
    }

    closeWorkflow() {
        let html = document.getElementsByTagName('html')[0];
        let body = document.getElementsByTagName('body')[0];
        html.style.removeProperty('overflow');
        body.style.removeProperty('overflow');
        html.style.removeProperty('margin');
        body.style.removeProperty('margin');
        this.is_open = false;
        document.body.removeChild(this.iframe);
    }
}

export default SynapsClient;
