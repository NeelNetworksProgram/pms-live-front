import { create } from 'zustand'

const useStore = create(set => ({
  count: 111,
  inc: () => set(state => ({ count: state.count + 1 })),
  dcr: () => set(state => ({ count: state.count - 1 }))
}))

const Controls = () => {
  const inc = useStore(state => state.inc)
  const dcr = useStore(state => state.dcr)
  return (
    <>
    <button onClick={inc}>one up</button>
    <button onClick={dcr}>one down</button>
    </>
  )
}

const Counter = () => {
  const abc = useStore(state => state.count)
  return (
    <>
        <h1>{abc}</h1> 
        <Controls />
    </>
  ) 
}

export default Counter;
// export {Controls};