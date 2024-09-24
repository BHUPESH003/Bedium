import React, { useState } from 'react';
import { Button } from './button';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAuth } from '@/store';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useAtom(userAuth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      localStorage.removeItem("userAuth");
      setIsAuthenticated(false);
    } else {
      navigate('/signin');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center">
      {/* Brand Name */}
      <Link to={'/'}>
        <div className="text-xl font-bold">Bedium</div>
      </Link>

      {/* Mobile Menu Toggle */}
      <button className="md:hidden" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? '✖️' : '☰'} {/* Hamburger icon */}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center">
        {isAuthenticated && (
          <Button variant="default" className='mx-2' onClick={() => { navigate('/blog/create') }}>
            Create A Blog Post
          </Button>
        )}
        <Button variant="default" onClick={handleAuthAction}>
          {isAuthenticated ? 'Logout' : 'Login'}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
         
          {isAuthenticated && (
            <Button variant="default" className='block w-50 md:w-full my-2 text-left p-2 ' onClick={() => { 
              navigate('/blog/create'); 
              setMobileMenuOpen(false); 
            }}>
              Create A Blog Post
            </Button>
          )}
          <Button variant="default" className='block w-50 md:w-full text-left my-2 p-2' onClick={handleAuthAction}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        
        </div>
      )}
    </nav>
  );
};

export default NavBar;
