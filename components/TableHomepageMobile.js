// components/TableHomepageMobile.js
import React, { useEffect, useState } from "react";
import TableNameMobile from "./TableNameMobile";
import TableMissionMobile from "./TableMissionMobile";
import TableLocationsMobile from "./TableLocationsMobile";
import TableSocialMobile from "./TableSocialMobile";
import TableTagsMobile from "./TableTagsMobile";
import TableCTA from "./TableCTA";
import SortingLocation from "./SortingLocation";
import SortingSocial from "./SortingSocial";
import SortingTags from "./SortingTags";
import { fetchTableNames } from "../utils/fetchAirtableData";

export default function TableHomepageMobile() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSocialFilters, setSelectedSocialFilters] = useState([]);
  const [selectedTagFilters, setSelectedTagFilters] = useState([]);
  const [selectedLocationFilters, setSelectedLocationFilters] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);

  const gridColumns = "auto auto";

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTableNames();
      setTableData(data);
      setFilteredData(data);

      // Extract unique locations and sort alphabetically (case-insensitive)
      const locations = new Set();
      data.forEach((item) => {
        if (Array.isArray(item.baseLocations)) {
          item.baseLocations.forEach((location) =>
            locations.add(location.trim())
          );
        }
      });
      setUniqueLocations(
        [...locations].sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: "base" })
        )
      );

      // Extract unique tags and sort alphabetically (case-insensitive)
      const tags = new Set();
      data.forEach((item) => {
        if (Array.isArray(item.tags)) {
          item.tags.forEach((tag) => tags.add(tag.trim()));
        }
      });
      setUniqueTags(
        [...tags].sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: "base" })
        )
      );
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = tableData;

      if (selectedSocialFilters.length > 0) {
        filtered = filtered.filter((item) =>
          selectedSocialFilters.some((filter) => item[filter.toLowerCase()])
        );
      }

      if (selectedLocationFilters.length > 0) {
        filtered = filtered.filter((item) =>
          selectedLocationFilters.some((filter) =>
            item.baseLocations.includes(filter)
          )
        );
      }

      if (selectedTagFilters.length > 0) {
        filtered = filtered.filter((item) =>
          selectedTagFilters.some((filter) =>
            item.tags.some((tag) => tag.trim() === filter)
          )
        );
      }

      setFilteredData(filtered);
    };

    applyFilters();
  }, [
    selectedSocialFilters,
    selectedLocationFilters,
    selectedTagFilters,
    tableData,
  ]);

  const handleSocialFilterChange = (selectedItems) => {
    setSelectedSocialFilters(selectedItems);
  };

  const handleLocationFilterChange = (selectedItems) => {
    setSelectedLocationFilters(selectedItems);
  };

  const handleTagFilterChange = (selectedItems) => {
    setSelectedTagFilters(selectedItems);
  };

  return (
    <div className="lg:hidden mx-auto mt-12" style={{ maxWidth: "1100px" }}>
      {/* 1. Sorting row */}
      <div className="flex justify-between bg-background">
        <span>
          <SortingLocation
            locations={uniqueLocations}
            onSelectedItemsChange={handleLocationFilterChange}
          />
        </span>
        <span>
          <SortingSocial onSelectedItemsChange={handleSocialFilterChange} />
        </span>
        <span>
          <SortingTags
            tags={uniqueTags}
            onSelectedItemsChange={handleTagFilterChange}
          />
        </span>
      </div>

      {/* 3. Info rows */}
      {filteredData.map((data, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-3 p-3 mt-4 bg-white border-[2.5px] rounded-md shadow-custom2 justify-between"
          style={{ gridTemplateColumns: gridColumns }}
        >
          {" "}
          <div className="flex flex-col">
            <span className="w-full sm:w-auto">
              <TableNameMobile
                name={data.name}
                logo={data.logoURL}
                linkUrl={data.url}
              />
            </span>
            <span className="w-full sm:w-auto">
              <TableMissionMobile mission={data.mission} />
            </span>
            <span className="w-full sm:w-auto">
              <TableLocationsMobile baseLocations={data.baseLocations} />
            </span>
            <span className="w-full sm:w-auto">
              <TableTagsMobile baseTags={data.tags} />
            </span>
            <span className="w-full sm:w-auto">
              <TableSocialMobile
                linkUrl={data.url}
                xUrl={data.x}
                discordUrl={data.discord}
                xFollowers={data.xFollowers}
                discordMembers={data.discordMembers}
              />
            </span>
          </div>
          <span>
            <TableCTA application={data.application} />
          </span>
        </div>
      ))}

      <div className="flex justify-center mt-8">
        {/* Add pagination controls here */}
      </div>
    </div>
  );
}
