'use client';
import { useState } from "react";
import Order from './components/order'

export default function Home() {
  const [show, setShow] = useState(true)
  const [categoryName, setCategoryName] =  useState("")

  const category = [
    {name:"wines",img:"wines"},
    {name:"brandy cognac",img:"brandy"},
    {name:"spirits & liqueurs",img:"liquor"},    
    {name:"cocktails",img:"cocktails"},
    {name:"mocktails",img:"mocktails"},
    {name:"soft drinks",img:"soft-drink"},
    {name:"port & dessert wines",img:"dessert-wines"},
    {name:"tea & coffees",img:"coffee"},
    {name:"desserts",img:"desserts"},
    {name:"dinne in",img:"food"},
    {name:"takeaway",img:"takeaway"},
    {name:"popular selection",img:"trending-up"},
    {name:"kids menu",img:"kids-menu"},
    {name:"Bill",img:"bill"},
  ]

  const displayItem = (key: string, e: React.MouseEvent<HTMLElement>) => {
    const button = (e.target as HTMLElement).closest('[data-button]');
    if (button) {
      // console.log('Button clicked:', key, button);
      setCategoryName(key)
      setShow(false)
    }
  }

  const backToMenu = () => {
    setShow(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      {/* header */}
      <div className="flex items-center space-x-4 p-4 md:p-10">
        <header className="font-bold text-4xl">EasyOrder</header>
        {/* <img className="bg-white rounded-full p-1" src="/images/tequila-sunrise.png" alt="" /> */}
      </div>
      {/* layout */}
      <div className={show ? "text-black flex flex-wrap md:w-8/12 lg:w-8/12 justify-center gap-2" : "hidden"}>
        {
          category.map(item =>(
            <div key={item.name} className="w-4/12 md:w-4/12 lg:w-3/12 bg-white hover:bg-orange-300 md:uppercase text-center ...">
              <button onClick={(e) => displayItem(item.name, e)} className="w-full p-4 " data-button>
                  <p>{item.name}</p>
                  <img className="w-8 md:w-16 m-auto" src={"/svg/" + item.img + ".svg"} alt="" />
              </button>
            </div>
          ))
        }
      </div>
      { !show && <Order categoryName={categoryName} /> } 
      <div className={!show ? "w-4/12 md:w-4/12 lg:w-3/12 bg-white hover:bg-orange-300 md:uppercase text-center ..." : "hidden"}>
        <button onClick={backToMenu} className="w-full p-4">back</button>
      </div>
    </main>
  )
}
