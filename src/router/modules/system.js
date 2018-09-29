/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  name: 'system',
  meta: { title: 'system', icon: 'example', roles: ['admin'] },
  children: [
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/system/user/index'),
      meta: { title: 'user', icon: 'form' }
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/views/system/role/index'),
      meta: { title: 'role', icon: 'form' }
    },
    {
      path: 'dept',
      name: 'dept',
      component: () => import('@/views/system/dept/index'),
      meta: { title: 'dept', icon: 'form' }
    }
  ]
}

export default systemRouter
