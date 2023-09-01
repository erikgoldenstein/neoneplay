import Image from 'next/image';
import Settings from './Buttons/Settings';
import ThemeSwitch from './Buttons/ThemeSwitch';
import Searchbar from './Searchbar';
import AddLogisticsObjects from './Buttons/AddLogisticsObjects';



const Header = () => {
    return (
        <header className="w-full bg-slate-50 dark:bg-slate-700 z-10 flex p-2 duration-200 transition-all">
            <div className="h-[5vw] w-[17vw] max-h-[60px] max-w-[210px] relative my-auto bg-slate-100 dark:bg-slate-800 rounded-full duration-200 transition-all" >
                <Image className="flex pr-2" src="/header_logo.png"
                    style={{objectFit: "contain"}}	
                    fill={'true'}
                    alt='LOGO'
                />
            </div>
            <Searchbar />
            {/* icon tray */}
            <div className='inline-flex m-2 my-auto p-3 bg-slate-100 dark:bg-slate-800 rounded-full  duration-200 transition-all'>
                <AddLogisticsObjects />
                <Settings />
                <ThemeSwitch />
            </div>
        </header >
    )
}

export default Header;