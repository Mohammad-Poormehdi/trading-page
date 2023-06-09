import SideBar from "@/components/SideBar";
import SideBarItem from "@/components/SideBarItem";
import WatchList from "@/components/WatchList";
import History from "@/components/History";
import Navbar from "@/components/Navbar";
import Orders from "@/components/Orders";
import BuySell from "@/components/BuySell";
import Footer from "@/components/Footer";
import ParentTab from "@/components/ParentTab";
import MobileMenu from "@/components/MobileMenu";
import Tab from "@/components/Tab";
import SearchModal from "@/components/SearchModal";
import Modal from "@/components/Modal";
import dynamic from "next/dynamic";
const TVChartContainer = dynamic(
  () =>
    import("../components/TVChartContainer").then(
      (mod) => mod.TVChartContainer
    ),
  { ssr: false }
);
import {
  faBars,
  faHistory,
  faMessage,
  faAreaChart,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import MobileNav from "@/components/MobileNav";
import ExpandedSideBar from "@/components/ExpandedSideBar";
import { createChart } from "lightweight-charts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TradingChart from "@/components/Chart/TradingViewChart";

export default function TradingPage() {
  // this data should be fetched from an API
  const symbols = [
    { id: 1, name: "EUR/USD" },
    { id: 2, name: "Bitcoin" },
  ];

  const sideBarItems = [
    { id: 1, icon: faBars, text: "watch list" },
    { id: 2, icon: faHistory, text: "History" },
  ];
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSideBarItem, setSelectedSideBarItem] = useState(null);
  const [activeButtonId, setActiveButtonId] = useState(null);
  const [tabIds, setTabIds] = useState([]);
  const [activeSymbolTab, setActiveSymbolTab] = useState(1);
  const [activeOrderTab, setActiveOrderTab] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  function handleShowModal() {
    setShowModal(true);
  }
  function handleCloseModal() {
    setShowModal(false);
  }
  function handleAddTab(id) {
    setTabIds([...tabIds, id]);
  }
  function handleActiveSymbolTab(id) {
    setActiveSymbolTab(id);
  }
  function handleShowMenu() {
    setShowMenu(!showMenu);
  }
  function handleExpand(id) {
    setIsExpanded(true);
    setActiveButtonId(id);
    setSelectedSideBarItem(sideBarItems.filter((item) => item.id === id)[0]);
  }
  function handleClose() {
    setIsExpanded(false);
    setActiveButtonId(null);
  }

  return (
    <>
      <MobileNav onShowMenu={handleShowMenu}></MobileNav>

      <Navbar>
        <ParentTab onShowModal={handleShowModal}>
          {symbols
            .filter((symbol) => tabIds.includes(symbol.id))
            .map((symbol) => (
              <Tab
                activeId={activeSymbolTab}
                onActive={handleActiveSymbolTab}
                key={symbol.id}
                id={symbol.id}
                name={symbol.name}
              />
            ))}
        </ParentTab>
      </Navbar>
      <Modal showModal={showModal} onClose={handleCloseModal}>
        <SearchModal onAddSymbol={handleAddTab} symbols={symbols} />
      </Modal>
      {showMenu && (
        <MobileMenu>
          {!isExpanded &&
            sideBarItems.map((sideBarItem) => (
              <SideBarItem
                showMenu={showMenu}
                activeId={activeButtonId}
                onExpand={handleExpand}
                key={sideBarItem.id}
                id={sideBarItem.id}
                icon={sideBarItem.icon}
                text={sideBarItem.text}
              />
            ))}
          {isExpanded && (
            <ExpandedSideBar
              title={selectedSideBarItem.text}
              onClose={handleClose}
            >
              {activeButtonId == 1 ? <WatchList /> : <History />}
            </ExpandedSideBar>
          )}
        </MobileMenu>
      )}
      <div className="md:hidden">
        <ParentTab onShowModal={handleShowModal}>
          {symbols
            .filter((symbol) => tabIds.includes(symbol.id))
            .map((symbol) => (
              <Tab
                activeId={activeSymbolTab}
                onActive={handleActiveSymbolTab}
                key={symbol.id}
                id={symbol.id}
                name={symbol.name}
              />
            ))}
        </ParentTab>
      </div>
      <div className="grid grid-cols-12 w-full h-[90%] max-md:block">
        <SideBar isExpanded={isExpanded}>
          {sideBarItems.map((sideBarItem) => (
            <SideBarItem
              showMenu={showMenu}
              activeId={activeButtonId}
              onExpand={handleExpand}
              key={sideBarItem.id}
              id={sideBarItem.id}
              icon={sideBarItem.icon}
              text={sideBarItem.text}
            />
          ))}
          {isExpanded && (
            <ExpandedSideBar
              title={selectedSideBarItem.text}
              onClose={handleClose}
            >
              {activeButtonId == 1 ? <WatchList /> : <History />}
            </ExpandedSideBar>
          )}
        </SideBar>

        <div className="w-full h-full bg-slate-700 col-span-9 max-md:row-span-7  ">
          <TVChartContainer />

          <Orders />
          <Footer />
        </div>
        <div className="col-span-2 ">
          <BuySell />
        </div>
      </div>
    </>
  );
}
