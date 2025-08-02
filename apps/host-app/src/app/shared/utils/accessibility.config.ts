export interface AccessibilityConfig {
    skipLinks: SkipLink[];
    focusableSelectors: string[];
    announcementDelay: number;
    keyboardShortcuts: KeyboardShortcut[];
    contrastThresholds: ContrastThresholds;
}

export interface SkipLink {
    id: string;
    label: string;
    target: string;
}

export interface KeyboardShortcut {
    key: string;
    description: string;
    action: string;
}

export interface ContrastThresholds {
    AA: number;
    AAA: number;
}

export const ACCESSIBILITY_CONFIG: AccessibilityConfig = {
    skipLinks: [
        {
            id: 'skip-main',
            label: 'Pular para o conteúdo principal',
            target: 'main-content'
        },
        {
            id: 'skip-nav',
            label: 'Pular para a navegação',
            target: 'sidebar'
        }
    ],

    focusableSelectors: [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[role="button"]',
        '[role="link"]',
        '[role="menuitem"]',
        '[role="tab"]'
    ],

    announcementDelay: 1000,

    keyboardShortcuts: [
        {
            key: 'Tab',
            description: 'Navegar entre elementos',
            action: 'navigate'
        },
        {
            key: 'Enter',
            description: 'Ativar elemento',
            action: 'activate'
        },
        {
            key: 'Space',
            description: 'Ativar elemento',
            action: 'activate'
        },
        {
            key: 'Escape',
            description: 'Fechar modal/menu',
            action: 'close'
        },
        {
            key: 'Arrow keys',
            description: 'Navegar em listas/menus',
            action: 'navigate'
        }
    ],

    contrastThresholds: {
        AA: 4.5,
        AAA: 7.0
    }
};

export const ARIA_LABELS = {
    // Navegação
    NAV_MAIN: 'Navegação principal',
    NAV_SIDEBAR: 'Menu lateral de navegação',
    NAV_MOBILE: 'Menu de navegação móvel',

    // Botões
    BTN_MENU_TOGGLE: 'Alternar menu',
    BTN_CLOSE: 'Fechar',
    BTN_SUBMIT: 'Enviar',
    BTN_CANCEL: 'Cancelar',
    BTN_SAVE: 'Salvar',
    BTN_EDIT: 'Editar',
    BTN_DELETE: 'Excluir',
    BTN_LOGOUT: 'Sair da conta',

    // Formulários
    FORM_LOGIN: 'Formulário de login',
    FORM_TRANSACTION: 'Formulário de transação',
    FIELD_USERNAME: 'Nome de usuário',
    FIELD_EMAIL: 'Endereço de email',
    FIELD_PASSWORD: 'Senha',
    FIELD_AMOUNT: 'Valor',
    FIELD_DESCRIPTION: 'Descrição',
    FIELD_CATEGORY: 'Categoria',
    FIELD_DATE: 'Data',
    FIELD_FILE: 'Arquivo',

    // Estados
    STATE_LOADING: 'Carregando',
    STATE_SUCCESS: 'Sucesso',
    STATE_ERROR: 'Erro',
    STATE_DISABLED: 'Desabilitado',

    // Mensagens
    MSG_PAGE_LOADED: 'Página carregada',
    MSG_FORM_SUBMITTED: 'Formulário enviado',
    MSG_TRANSACTION_CREATED: 'Transação criada com sucesso',
    MSG_ERROR_OCCURRED: 'Ocorreu um erro',

    // Ícones
    ICON_MENU: 'Menu',
    ICON_CLOSE: 'Fechar',
    ICON_EDIT: 'Editar',
    ICON_DELETE: 'Excluir',
    ICON_LOGOUT: 'Sair',
    ICON_VISIBILITY: 'Mostrar senha',
    ICON_VISIBILITY_OFF: 'Ocultar senha',
    ICON_ATTACH_FILE: 'Anexar arquivo',
    ICON_CATEGORY: 'Categoria',
    ICON_LOADING: 'Carregando'
};

export const ROLES = {
    BANNER: 'banner',
    NAVIGATION: 'navigation',
    MAIN: 'main',
    FORM: 'form',
    BUTTON: 'button',
    LINK: 'link',
    LIST: 'list',
    LISTITEM: 'listitem',
    DIALOG: 'dialog',
    MENU: 'menu',
    MENUITEM: 'menuitem',
    TAB: 'tab',
    TABPANEL: 'tabpanel',
    TOOLBAR: 'toolbar',
    SEARCH: 'search',
    COMPLEMENTARY: 'complementary',
    CONTENTINFO: 'contentinfo'
};

export const ARIA_STATES = {
    EXPANDED: 'aria-expanded',
    PRESSED: 'aria-pressed',
    SELECTED: 'aria-selected',
    HIDDEN: 'aria-hidden',
    DISABLED: 'aria-disabled',
    INVALID: 'aria-invalid',
    REQUIRED: 'aria-required',
    DESCRIBEDBY: 'aria-describedby',
    LABELLEDBY: 'aria-labelledby',
    CONTROLS: 'aria-controls',
    HASPOPUP: 'aria-haspopup',
    LIVE: 'aria-live',
    ATOMIC: 'aria-atomic'
}; 