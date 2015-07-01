export default {
  button: {
    create: "创建",
    creating: "创建中...",
    edit: "编辑",
    editting: "编辑中...",
    delete: "删除",
    deleting: "删除中...",
    ok: "确定",
    cancel: "取消",
    login: "登录",
    logout: "登出",
    tag: "标签",
    category: "分类",
    back: "返回",
    save: "保存",
    saving: "保存中...",
    reply: "回复"
  },

  placeholder: {
    required: '必填',
    unrequired: '选填'
  },

  ajax: {
    error: {
      operate: '操作失败',
      validate: '验证登录失败',
      request: '请求失败',
      logout: '登出失败',
      post: '加载文章失败',
      timeout: '请求超时'
    }
  },

  destroy: {
    prompt: '删除',
    body: '确定删除吗？'
  },

  blog: {
    title: "问道",
    description: "路漫漫其修远兮，吾将上下而求索",
    home: "首页",
    posts: "文章",
    admin: "设置",
    creator: "作者",
    tag: "标签",
    category: "分类"
  },

  posts: {
    latest: '最新文章',
    loading: '加载中...',
    loadedall: '已全部加载',
    search: '按标题、分类或作者搜索',
    title: '标题',
    create: {
      header: '写文章',
      errorTitle: '创建文章失败',
      error: {
        unlogon: '您还未登录，请先登录。',
        required: '标题不能为空，内容必须填写，分类必须选择。'
      }
    },
    edit: {
      header: '编辑文章',
      errorTitle: '编辑失败',
      error: {
        unlogon: '您还未登录，请先登录。',
        required: '标题不能为空，内容必须填写，分类必须选择。'
      }
    },
    destroy: {
      prompt: '删除文章',
      body: '确认删除吗？'
    },
    readMore: '阅读更多',
    editor: '编辑',
    preview: '预览',
    comment: {
      header: '评论',
      count: '个评论',
      email: '邮件',
      name: '姓名',
      content: '内容',
      create: {
        error: {
          required: '内容不能为空。',
          invalid: '邮件地址不能为空。'
        }
      },
      destroy: {
        prompt: '删除评论',
        body: '确认删除吗？',
        error: '删除评论失败'
      }
    }
  },

  settings: {
    title: '设置',
    section: {
      header: {
        option: '选项',
        language: '选择语言'
      }
    },
    language: {
      title: '语言',
      enUS: '美国英语',
      zhCN: '简体中文'
    },
    tag: {
      title: '标签',
      header: '标签列表',
      create: '创建一个标签'
    },
    category: {
      title: '分类',
      header: '分类列表',
      create: '创建一个分类'
    },
    term: {
      create: {
        error: '创建%@失败',
        required: "%@名称不能为空"
      }
    },
    mine: {
      title: '个人资料',
      username: '用户名',
      name: '姓名',
      email: '邮件',
      password: '密码',
      editPassword: '编辑密码',
      oldPassword: '旧密码',
      newPassword: '新密码',
      checkPassword: '确认密码',
      passwordNotMatch: '两次密码不相符'
    }
  },

  login: {
    title: '登录',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    or: '或者',
    forgotPassword: '忘记密码',
    google: '使用Google登录',
    github: '使用Github登录',
    logging: '登录中...',
    authenticating: '验证中...',
    authenticate: {
      error: '用户名或密码错误。'
    },
    error: '登出失败'
  },

  createAccount: {
    title: '注册',
    registering: '注册中...',
    tip: '没有帐号？',
    now: '现在就注册',
    cancel: '取消',
    name: '名称',
    email: '邮件',
    username: '用户名',
    password: '密码',
    prompt: {
      too_short: '%@ 太短。',
      ok: '%@ 已确认。',
      invalid: '%@ 不符合。',
      validating: '%@ 验证中...',
      exists: '%@ 已存在。'
    },
    error: '注册失败。',
    success: '注册成功。'
  },

  forgot: {
    title: '忘记密码。',
    tip: '请输入邮件地址，我们会发送重置密码的邮件。',
    email: '邮件地址',
    send: '发送',
    sending: '发送中...',
    sendSuccess: '忘记密码的邮件发送成功。',
    cancel: '取消'
  }
};
