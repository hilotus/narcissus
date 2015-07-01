export default {
  button: {
    create: "Create",
    creating: "Creating...",
    edit: "Edit",
    editting: "Editting...",
    delete: "Delete",
    deleting: "Deleting...",
    ok: "OK",
    cancel: "Cancel",
    login: "Sign in",
    logout: "Sign out",
    tag: "Tag",
    category: "Category",
    back: "Back",
    save: "Save",
    saving: "Saving...",
    reply: "Reply"
  },

  placeholder: {
    required: 'Required',
    unrequired: 'Unrequired'
  },

  ajax: {
    error: {
      operate: 'Operation Failure',
      validate: 'Authenticate Failure',
      request: 'Request Failure',
      logout: 'Sign out Failure',
      post: 'Load Posts Failure',
      timeout: 'Request Timeout'
    }
  },

  destroy: {
    prompt: 'Delete',
    body: 'Confirm to delete?'
  },

  blog: {
    title: "Guide",
    description: "The road ahead will be long and our climb will be steep",
    home: "Home",
    posts: "Article",
    admin: "Settings",
    creator: "Author",
    tag: "Tag",
    category: "Category"
  },

  posts: {
    latest: 'Recent Articles',
    loading: 'Loading...',
    loadedall: 'Loaded',
    search: 'Search by title/category/author',
    title: 'Title',
    create: {
      header: 'Write Article',
      errorTitle: 'Create Error',
      error: {
        unlogon: 'Please sign in first.',
        required: 'Title/content/category are required.'
      }
    },
    creating: 'Creating...',
    edit: {
      header: 'Edit Article',
      errorTitle: 'Edit Failure',
      error: {
        unlogon: 'Please sign in first.',
        required: 'Title/content/category are required.'
      }
    },
    destroy: {
      prompt: 'Delete Article',
      body: 'Are you sure to delete?'
    },
    destroying: 'Deleting...',
    readMore: 'Read Continue',
    editor: 'Edit',
    preview: 'Preview',
    comment: {
      header: 'Comment',
      count: 'comment(s)',
      email: 'Email',
      name: 'Name',
      content: 'Content',
      create: {
        error: {
          required: 'Content is required.',
          invalid: 'Email is invalid.'
        }
      },
      destroy: {
        prompt: 'Delete Comment',
        body: 'Are you sure to delete?',
        error: 'Delete comment failure.'
      }
    }
  },

  settings: {
    title: 'Settings',
    section: {
      header: {
        option: 'Options',
        language: 'Select Language'
      }
    },
    language: {
      title: 'Language',
      enUS: 'US English',
      zhCN: 'Simple Chinese'
    },
    tag: {
      title: 'Tag',
      header: 'Tag List',
      create: 'Create a tag'
    },
    category: {
      title: 'Category',
      header: 'Category List',
      create: 'Create a category'
    },
    term: {
      create: {
        error: 'Create %@ failure',
        required: "%@'s name is required."
      }
    },
    mine: {
      title: 'My Profile',
      username: 'Username',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      editPassword: 'Edit Password',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      checkPassword: 'Confirm Password',
      passwordNotMatch: 'Password is not match.'
    }
  },

  login: {
    title: 'Sign in',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    or: 'Or',
    forgotPassword: 'Forgot password',
    google: 'Google Sign in',
    github: 'Github Sign in',
    logging: 'Sign in...',
    authenticating: 'Authenticating...',
    authenticate: {
      error: 'username or password are failure.'
    },
    error: 'Sign in failure'
  },

  createAccount: {
    title: 'Register',
    registering: 'Registering...',
    tip: 'No Account?',
    now: 'Register now',
    cancel: 'Cancel',
    name: 'Name',
    email: 'Email',
    username: 'Username',
    password: 'Password',
    prompt: {
      too_short: '%@ is too short.',
      ok: '%@ is ok.',
      invalid: '%@ is invalid.',
      validating: '%@ validating...',
      exists: '%@ is existing.'
    },
    error: 'Register Failure.',
    success: 'Register Success.'
  },

  forgot: {
    title: 'Forgot Password',
    tip: 'Please type your email, we will send your e email to reset password.',
    email: 'Email',
    send: 'Send',
    sending: 'Sending...',
    sendSuccess: 'Send Email Success.',
    cancel: 'Cancel'
  }
};
