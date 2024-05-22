import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { CaretDownOutlined, CloseOutlined } from '@ant-design/icons'

// const items = [
//   { id: 1, name: 'Rick Sanchez', episodes: 51 },
//   { id: 2, name: 'Black Rick', episodes: 2 },
//   { id: 3, name: 'Cool Rick', episodes: 1 },
//   { id: 4, name: 'Cop Rick', episodes: 1 },
//   { id: 5, name: 'Cowboy Rick', episodes: 2 },
//   { id: 6, name: 'Mega Fruit Farmer Rick', episodes: 1 },
//   { id: 7, name: 'Pickle Rick', episodes: 1 },
// ];

const InputComponent = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputFocus = useRef(null);

  useEffect(() => {
    handleAPICall();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAPICall = () => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((response) => response.json())
      .then((data) => {
        setItems(data?.results);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
      // setSearchTerm('')
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isDropdownOpen) setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && searchTerm === '') {
      const lastSelectedItem = selectedItems[selectedItems.length - 1];
      if (lastSelectedItem) {
        handleRemoveItem(lastSelectedItem);
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="multi-select" ref={dropdownRef}>
      <div className="input-container" onClick={() => { setIsDropdownOpen(true); inputFocus.current.focus()}}>
        {selectedItems.map((item) => (
          <div key={item.id} className="selected-item">
            {item.name}
            <button onClick={(e) => {e.stopPropagation(); handleRemoveItem(item);}}>
                <CloseOutlined style={{color: 'white', height: '19px', marginLeft: '-2px'}} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={selectedItems.length === 0 && 'Search here...'}
          ref={inputFocus}
        />
        <div className='drop-icon'>
            <CaretDownOutlined style={{color: '#475569'}} />
        </div>
      </div>
      {isDropdownOpen && (
        <ul className="dropdown">
        {
          filteredItems.length > 0 ? filteredItems.map((item) => (
              <li key={item.id}>
              <label>
                  <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => {handleCheckboxChange(item); inputFocus.current.focus()}}
                  />
                  <div className='content'>
                      <div className='image'>
                          <img src={item?.image} alt="" loading='lazy' />
                      </div>
                      
                      <div className='text'>
                          <span dangerouslySetInnerHTML={{ __html: highlightText(item.name, searchTerm) }} />
                          {' '}
                          <span className="episodes">
                              {item?.episode?.length} {' '}
                              Episode{item?.episode?.length > 1 && 's'}
                          </span>
                      </div>
                  </div>
              </label>
              </li>
          )) : <span style={{display: 'grid', placeItems: 'center', height: '150px'}}>No Record Found</span>
        }
        </ul>
      )}
    </div>
  );
};

const highlightText = (text, highlight) => {
  if (!highlight.trim()) {
    return text;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  return text.replace(regex, '<b>$1</b>');
};

export default InputComponent;
