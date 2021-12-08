import { FC } from 'react'
import 'twin.macro'
import 'styled-components/macro'

const Container: FC = ({ children }) => (
  <div tw="container flex flex-col items-center bg-white w-max mx-auto p-8 rounded-2xl shadow-lg">
    {children}
  </div>
)

export default Container
