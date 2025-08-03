import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LeadFilters from './components/LeadFilters';
import LeadActionBar from './components/LeadActionBar';
import LeadTable from './components/LeadTable';
import LeadProfileModal from './components/LeadProfileModal';
import MobileLeadCard from './components/MobileLeadCard';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LeadsManagement = () => {
  const location = useLocation();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(20);

  // Mock data for leads
  const mockLeads = [
    {
      id: 1,
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@email.com",
      source: "Housing.com",
      project: "Skyline Residences",
      assignedTo: "John Doe",
      status: "qualified",
      nurturingStage: "week2",
      nurturingProgress: 65,
      lastContact: "2024-01-20",
      lastContactType: "WhatsApp",
      createdDate: "2024-01-15",
      budget: "45-55 Lakhs",
      unitType: "2 BHK",
      timeline: "3-6 months",
      followUpStatus: "today"
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      email: "priya.sharma@email.com",
      source: "Website",
      project: "Marina Heights",
      assignedTo: "Sarah Smith",
      status: "nurturing",
      nurturingStage: "week1",
      nurturingProgress: 30,
      lastContact: "2024-01-19",
      lastContactType: "Call",
      createdDate: "2024-01-18",
      budget: "60-70 Lakhs",
      unitType: "3 BHK",
      timeline: "6-12 months",
      followUpStatus: "upcoming"
    },
    {
      id: 3,
      name: "Amit Patel",
      phone: "+91 76543 21098",
      email: "amit.patel@email.com",
      source: "Referral",
      project: "Garden View Apartments",
      assignedTo: null,
      status: "new",
      nurturingStage: "not-started",
      nurturingProgress: 0,
      lastContact: "2024-01-21",
      lastContactType: "Email",
      createdDate: "2024-01-21",
      budget: "35-45 Lakhs",
      unitType: "2 BHK",
      timeline: "1-3 months",
      followUpStatus: "overdue"
    },
    {
      id: 4,
      name: "Sunita Reddy",
      phone: "+91 65432 10987",
      email: "sunita.reddy@email.com",
      source: "MagicBricks",
      project: "Skyline Residences",
      assignedTo: "Mike Johnson",
      status: "contacted",
      nurturingStage: "week3-4",
      nurturingProgress: 80,
      lastContact: "2024-01-18",
      lastContactType: "Site Visit",
      createdDate: "2024-01-10",
      budget: "50-60 Lakhs",
      unitType: "2 BHK",
      timeline: "3-6 months",
      followUpStatus: "overdue"
    },
    {
      id: 5,
      name: "Vikram Singh",
      phone: "+91 54321 09876",
      email: "vikram.singh@email.com",
      source: "Social Media",
      project: "Downtown Plaza",
      assignedTo: "Lisa Brown",
      status: "converted",
      nurturingStage: "completed",
      nurturingProgress: 100,
      lastContact: "2024-01-17",
      lastContactType: "Booking",
      createdDate: "2024-01-05",
      budget: "80-90 Lakhs",
      unitType: "3 BHK",
      timeline: "Immediate",
      followUpStatus: "completed"
    },
    {
      id: 6,
      name: "Meera Joshi",
      phone: "+91 43210 98765",
      email: "meera.joshi@email.com",
      source: "Walk-in",
      project: "Marina Heights",
      assignedTo: "John Doe",
      status: "disqualified",
      nurturingStage: "paused",
      nurturingProgress: 45,
      lastContact: "2024-01-16",
      lastContactType: "Call",
      createdDate: "2024-01-12",
      budget: "Below Budget",
      unitType: "1 BHK",
      timeline: "Not Decided",
      followUpStatus: "completed"
    },
    {
      id: 7,
      name: "Arjun Nair",
      phone: "+91 32109 87654",
      email: "arjun.nair@email.com",
      source: "Housing.com",
      project: "Garden View Apartments",
      assignedTo: "Sarah Smith",
      status: "qualified",
      nurturingStage: "month2",
      nurturingProgress: 90,
      lastContact: "2024-01-20",
      lastContactType: "WhatsApp",
      createdDate: "2023-12-15",
      budget: "40-50 Lakhs",
      unitType: "2 BHK",
      timeline: "1-3 months",
      followUpStatus: "today"
    },
    {
      id: 8,
      name: "Kavya Menon",
      phone: "+91 21098 76543",
      email: "kavya.menon@email.com",
      source: "Website",
      project: "Skyline Residences",
      assignedTo: null,
      status: "new",
      nurturingStage: "not-started",
      nurturingProgress: 0,
      lastContact: "2024-01-21",
      lastContactType: "Form Submission",
      createdDate: "2024-01-21",
      budget: "55-65 Lakhs",
      unitType: "3 BHK",
      timeline: "6-12 months",
      followUpStatus: "upcoming"
    }
  ];

  useEffect(() => {
    // Initialize leads data
    setLeads(mockLeads);
    setFilteredLeads(mockLeads);

    // Check for mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle drill-down navigation from dashboard
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    if (filterParam) {
      let initialFilters = {};
      
      switch (filterParam) {
        case 'today-followups':
          initialFilters = { followUpStatus: ['today'] };
          break;
        case 'overdue-followups':
          initialFilters = { followUpStatus: ['overdue'] };
          break;
        case 'engagement':
          // Filter for highly engaged leads (high nurturing progress)
          initialFilters = { nurturingProgress: { min: 70 } };
          break;
        default:
          break;
      }
      
      setFilters(initialFilters);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [location.search]);

  useEffect(() => {
    // Apply filters
    let filtered = leads;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.sources && filters.sources.length > 0) {
      filtered = filtered.filter(lead =>
        filters.sources.some(source => lead.source.toLowerCase().includes(source))
      );
    }

    if (filters.projects && filters.projects.length > 0) {
      filtered = filtered.filter(lead =>
        filters.projects.some(project => lead.project.toLowerCase().includes(project))
      );
    }

    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(lead =>
        filters.statuses.includes(lead.status)
      );
    }

    if (filters.assignment && filters.assignment.length > 0) {
      filtered = filtered.filter(lead => {
        if (filters.assignment.includes('assigned') && lead.assignedTo) return true;
        if (filters.assignment.includes('unassigned') && !lead.assignedTo) return true;
        return false;
      });
    }

    // New filter for follow-up status
    if (filters.followUpStatus && filters.followUpStatus.length > 0) {
      filtered = filtered.filter(lead =>
        filters.followUpStatus.includes(lead.followUpStatus)
      );
    }

    // New filter for nurturing progress
    if (filters.nurturingProgress) {
      if (filters.nurturingProgress.min !== undefined) {
        filtered = filtered.filter(lead => lead.nurturingProgress >= filters.nurturingProgress.min);
      }
      if (filters.nurturingProgress.max !== undefined) {
        filtered = filtered.filter(lead => lead.nurturingProgress <= filters.nurturingProgress.max);
      }
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(lead =>
        new Date(lead.createdDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(lead =>
        new Date(lead.createdDate) <= new Date(filters.dateTo)
      );
    }

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [filters, leads]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleLeadSelect = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    const currentPageLeads = getCurrentPageLeads();
    const allSelected = currentPageLeads.every(lead => selectedLeads.includes(lead.id));
    
    if (allSelected) {
      setSelectedLeads(prev => prev.filter(id => !currentPageLeads.map(l => l.id).includes(id)));
    } else {
      setSelectedLeads(prev => [...new Set([...prev, ...currentPageLeads.map(l => l.id)])]);
    }
  };

  const handleBulkAction = (action, leadIds, data) => {
    console.log('Bulk action:', action, 'for leads:', leadIds, 'with data:', data);
    
    switch (action) {
      case 'assign':
        // Update leads with new assignment
        setLeads(prev => prev.map(lead =>
          leadIds.includes(lead.id)
            ? { ...lead, assignedTo: data.name }
            : lead
        ));
        break;
      case 'update-status':
        // Handle status update
        break;
      case 'start-nurturing':
        // Handle nurturing start
        break;
      case 'delete':
        // Handle deletion
        setLeads(prev => prev.filter(lead => !leadIds.includes(lead.id)));
        break;
      default:
        break;
    }
    
    setSelectedLeads([]);
  };

  const handleLeadAction = (leadId, action) => {
    const lead = leads.find(l => l.id === leadId);
    
    switch (action) {
      case 'view-profile':
        setSelectedLead(lead);
        setIsProfileModalOpen(true);
        break;
      case 'call': console.log('Initiating call for lead:', leadId);
        break;
      case 'whatsapp': console.log('Sending WhatsApp message to lead:', leadId);
        break;
      case 'qualify':
        console.log('Updating qualification status for lead:', leadId);
        break;
      case 'convert': console.log('Converting lead to opportunity:', leadId);
        break;
      case 'assign': console.log('Reassigning lead:', leadId);
        break;
      default:
        break;
    }
  };

  const handleUpdateLead = (updatedLead) => {
    setLeads(prev => prev.map(lead =>
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setSelectedLead(updatedLead);
  };

  const handleImportLeads = () => {
    console.log('Importing leads from Housing.com API');
    // Simulate API import
    alert('Lead import functionality would integrate with Housing.com API');
  };

  const handleExportLeads = () => {
    console.log('Exporting leads data');
    // Simulate export
    alert('Exporting leads data to CSV/Excel');
  };

  const getCurrentPageLeads = () => {
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    return filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  };

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedLeads([]);
  };

  // Get drill-down context for display
  const getDrillDownContext = () => {
    const urlParams = new URLSearchParams(location.search);
    const filterParam = urlParams.get('filter');
    
    switch (filterParam) {
      case 'today-followups':
        return { title: "Today's Follow-ups", description: "Leads requiring follow-up today" };
      case 'overdue-followups':
        return { title: "Overdue Follow-ups", description: "Leads with overdue follow-up actions" };
      case 'engagement':
        return { title: "Highly Engaged Leads", description: "Leads with high WhatsApp engagement activity" };
      default:
        return null;
    }
  };

  const drillDownContext = getDrillDownContext();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Users" size={24} className="text-primary" />
              <h1 className="text-2xl font-bold text-text-primary">
                {drillDownContext ? drillDownContext.title : 'Leads Management'}
              </h1>
            </div>
            <p className="text-text-secondary">
              {drillDownContext 
                ? drillDownContext.description 
                : 'Track, qualify, and nurture leads across multiple projects with automated WhatsApp integration'
              }
            </p>
            
            {/* Drill-down breadcrumb */}
            {drillDownContext && (
              <div className="flex items-center space-x-2 mt-2 text-sm">
                <button 
                  onClick={() => window.history.pushState({}, '', '/leads-management')}
                  className="text-primary hover:text-primary-dark transition-colors duration-200"
                >
                  All Leads
                </button>
                <Icon name="ChevronRight" size={14} className="text-text-muted" />
                <span className="text-text-secondary">{drillDownContext.title}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <LeadFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Action Bar */}
              <LeadActionBar
                selectedLeads={selectedLeads}
                onBulkAction={handleBulkAction}
                onImportLeads={handleImportLeads}
                onExportLeads={handleExportLeads}
              />

              {/* Results Summary */}
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  Showing {getCurrentPageLeads().length} of {filteredLeads.length} leads
                  {selectedLeads.length > 0 && (
                    <span className="ml-2 text-primary">
                      ({selectedLeads.length} selected)
                    </span>
                  )}
                </div>
                
                {/* View Toggle for Mobile */}
                {isMobile && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary">View:</span>
                    <Button variant="outline" size="sm" iconName="List">
                      Cards
                    </Button>
                  </div>
                )}
              </div>

              {/* Leads Display */}
              {isMobile ? (
                <div className="space-y-4">
                  {getCurrentPageLeads().map((lead) => (
                    <MobileLeadCard
                      key={lead.id}
                      lead={lead}
                      onLeadSelect={handleLeadSelect}
                      onLeadAction={handleLeadAction}
                      isSelected={selectedLeads.includes(lead.id)}
                    />
                  ))}
                </div>
              ) : (
                <LeadTable
                  leads={getCurrentPageLeads()}
                  onLeadSelect={handleLeadSelect}
                  onBulkAction={handleBulkAction}
                  selectedLeads={selectedLeads}
                  onSelectAll={handleSelectAll}
                  onLeadAction={handleLeadAction}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      iconName="ChevronLeft"
                    >
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                              currentPage === page
                                ? 'bg-primary text-primary-foreground'
                                : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Profile Modal */}
      <LeadProfileModal
        lead={selectedLead}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedLead(null);
        }}
        onUpdateLead={handleUpdateLead}
      />
    </div>
  );
};

export default LeadsManagement;