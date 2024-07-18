const routes = [
  {
    
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'tree', component: () => import('pages/TreePage.vue')},
      {path: 'emitter', component: () => import('pages/ConsoleEmitter.vue')},
      {path:'settings', component: () => import('pages/settingsPage.vue')},
      {path:'test', component: () => import('pages/testM.vue')}    
    ]


  },
  {
    path: '/console',
    name: 'console',
    component: () => import('pages/ConsoleReceiver.vue')
  } ,

  // // Always leave this as last one,
  // // but you can also remove it
  {
   
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
