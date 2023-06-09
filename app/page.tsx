'use client';
import { useState } from "react";
import Order from './components/order'
import Bill from './components/bill'
import Popularity from './components/popular-items'

export default function Home() {
  const [show, setShow] = useState<boolean>(true)
  const [categoryName, setCategoryName] =  useState<string>("")
  const [itemType, setItemType] =  useState<string>("")

  const category = [
    {name:"wines",img:"wines"},
    {name:"brandy cognac",img:"brandy"},
    {name:"spirits & liqueurs",img:"liquor"},
    {name:"beers",img:"beers"},
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
      let temp ='';
      switch (key) {
        case 'wines':
        case 'brandy cognac':
        case 'spirits & liqueurs':
        case 'beers':
        case 'cocktails':
        case 'mocktails':
        case 'soft drinks':
        case 'port & dessert wines':
          temp = 'drinks'
          break;
        case 'tea & coffees':
        case 'desserts':
          temp = 'desserts'
          break;
        case 'dinne in':
        case 'takeaway':
          temp = 'food'
          break;
        case 'kids menu':
          temp = 'kids_menu'
          break;
        default:
          break;
      }
      setItemType(temp)
      setCategoryName(key)
      setShow(false)
    }
  }

  const backToMenu = () => {
    setShow(true)
  }

  return (
    <main >
         {/* header */}
        <div className="absolute top-0 left-0 flex items-center bg-slate-900 w-fit border border-2 text-center p-6 m-6 rounded-lg">
          <header className="font-bold text-xl text-white"><span className="text-emerald-300 animate-pulse">E</span>asy<span className="text-emerald-300 animate-pulse">O</span>rder</header>
          <img className="m-auto rounded-full p-1" src="/images/tequila-sunrise.png" alt="" />
        </div>
      {/* layout */}
      <div className="flex flex-col items-center mt-10 md:mt-32 lg:mt-48">
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
        { !show && categoryName != 'Bill' &&  categoryName != 'popular selection' && <Order itemType={itemType} categoryName={categoryName} /> } 
        { !show && categoryName == 'Bill' && <Bill title={'tables'} style={''} tableButton={false} closeTablesUI={()=>{}} setTableNumber={()=>{}} tableNumber={'unselected'} setDataLoaded={()=>{}} /> } 
        { !show && categoryName == 'popular selection' && <Popularity /> } 
        <div className={`${!show ? "w-4/12 md:w-4/12 lg:w-2/12 bg-white hover:bg-orange-300 md:uppercase text-center m-2 ..." : "hidden"} ${categoryName == 'popular selection'? 'absolute top-5 right-5' : null}`}>
          <button onClick={backToMenu} className={`w-full p-4 uppercase font-bold`}>{categoryName == 'popular selection' ? <span className="text-2xl">&#x2B05;</span> : 'back'}</button>
        </div>
      </div>
    </main>
  )
}
