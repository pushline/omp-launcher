import { useEffect, useMemo } from "react";
import { useQuery } from "../../../../hooks/query";
import { useGenericTempState } from "../../../../states/genericStates";
import {
  usePersistentServersStore,
  useServers,
} from "../../../../states/servers";
import { Server } from "../../../../utils/types";
import List from "../List";
import ServerItem from "./../Item";
import { sortAndSearchInServerList } from "../../../../utils/helpers";

const RecentlyJoined = () => {
  const { startQuery, stopQuery } = useQuery();
  const { selected, setSelected } = useServers();
  const { recentlyJoined } = usePersistentServersStore();
  const { searchData } = useGenericTempState();

  useEffect(() => {
    return () => {
      stopQuery();
      setSelected(undefined);
    };
  }, []);

  const list = useMemo(() => {
    const { sortPing, sortPlayer, sortName, sortMode } = searchData;
    let list = sortAndSearchInServerList(recentlyJoined, searchData);

    if (
      sortPlayer === "none" &&
      sortPing === "none" &&
      sortName === "none" &&
      sortMode === "none"
    ) {
      list = list.reverse();
    }

    return list;
  }, [
    searchData.query,
    searchData.ompOnly,
    searchData.nonEmpty,
    searchData.sortPing,
    searchData.sortPlayer,
    searchData.sortName,
    searchData.sortMode,
    recentlyJoined,
  ]);

  const onSelect = (server: Server) => {
    stopQuery();
    setSelected(server);
    startQuery(server);
  };

  return (
    <List
      data={list}
      renderItem={(item, index) => (
        <ServerItem
          isSelected={
            selected
              ? selected.ip === item.ip && selected.port === item.port
              : false
          }
          server={item}
          index={index}
          onSelect={(server) => onSelect(server)}
        />
      )}
    />
  );
};

export default RecentlyJoined;
