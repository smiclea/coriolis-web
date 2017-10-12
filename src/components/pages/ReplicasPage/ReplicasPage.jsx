import React from 'react'

import { MainTemplate, Navigation, ReplicasView } from 'components'

const ReplicasPage = () => {
  return (
    <MainTemplate
      navigationComponent={<Navigation currentPage="replicas" />}
      contentComponent={<ReplicasView />}
    />
  )
}

export default ReplicasPage
