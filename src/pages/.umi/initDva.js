import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('D:/Codes/hi-antd/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('D:/Codes/hi-antd/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('D:/Codes/hi-antd/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('D:/Codes/hi-antd/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('D:/Codes/hi-antd/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('D:/Codes/hi-antd/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('D:/Codes/hi-antd/src/models/user.js').default) });
app.model({ namespace: 'register', ...(require('D:/Codes/hi-antd/src/pages/User/models/register.js').default) });
app.model({ namespace: 'activities', ...(require('D:/Codes/hi-antd/src/pages/Dashboard/models/activities.js').default) });
app.model({ namespace: 'chart', ...(require('D:/Codes/hi-antd/src/pages/Dashboard/models/chart.js').default) });
app.model({ namespace: 'monitor', ...(require('D:/Codes/hi-antd/src/pages/Dashboard/models/monitor.js').default) });
app.model({ namespace: 'form', ...(require('D:/Codes/hi-antd/src/pages/Forms/models/form.js').default) });
app.model({ namespace: 'rule', ...(require('D:/Codes/hi-antd/src/pages/List/models/rule.js').default) });
app.model({ namespace: 'profile', ...(require('D:/Codes/hi-antd/src/pages/Profile/models/profile.js').default) });
app.model({ namespace: 'error', ...(require('D:/Codes/hi-antd/src/pages/Exception/models/error.js').default) });
app.model({ namespace: 'geographic', ...(require('D:/Codes/hi-antd/src/pages/Account/Settings/models/geographic.js').default) });
