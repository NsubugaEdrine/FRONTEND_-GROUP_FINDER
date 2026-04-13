import React, { useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [joinFeedback, setJoinFeedback] = useState([]);
  const [courseFilter, setCourseFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({});

  const loadAdminData = async () => {
    try {
      const [groupsRes, studentsRes, feedbackRes] = await Promise.all([
        api.get('/groups'),
        api.get('/auth/students'),
        api.get('/groups/feedback/admin/join')
      ]);
      setGroups(groupsRes.data || []);
      setStudents(studentsRes.data?.students || []);
      setJoinFeedback(feedbackRes.data?.feedback || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const totalMembers = useMemo(
    () => groups.reduce((acc, group) => acc + (group.members?.length || 0), 0),
    [groups]
  );

  const assignLeader = async (groupId, userId) => {
    if (!userId) return;
    try {
      setAssigning((prev) => ({ ...prev, [groupId]: true }));
      await api.put(`/groups/${groupId}/leader/${userId}`);
      await loadAdminData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to assign leader');
    } finally {
      setAssigning((prev) => ({ ...prev, [groupId]: false }));
    }
  };

  const courseOptions = useMemo(
    () => [...new Set(students.map((s) => s.program_of_study).filter(Boolean))],
    [students]
  );

  const filteredStudents = useMemo(
    () => students.filter((s) => (courseFilter ? s.program_of_study === courseFilter : true)),
    [students, courseFilter]
  );

  const groupsWithoutLeader = useMemo(
    () => groups.filter((g) => !g.members?.some((m) => m.GroupMember?.role === 'LEADER')),
    [groups]
  );

  if (loading) {
    return <div className="container" style={{ padding: '2rem 1rem' }}>Loading admin dashboard...</div>;
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '0.5rem' }}>Admin access required</h2>
          <p style={{ color: 'var(--text-muted)' }}>Only admins can manage group leadership.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>Admin Overview</h1>
        <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>Student View</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--primary-color)' }}>
            <Users size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Group Memberships</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalMembers}</p>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--secondary-color)' }}>
            <BookOpen size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Study Groups</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{groups.length}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger-color)' }}>
            <Activity size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Groups With Leader</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              {groups.filter((g) => g.members?.some((m) => m.GroupMember?.role === 'LEADER')).length}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary-color)" /> Assign Group Leaders
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 0' }}>Group</th>
              <th style={{ padding: '1rem 0' }}>Current Leader</th>
              <th style={{ padding: '1rem 0' }}>Assign New Leader</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const currentLeader = group.members?.find((m) => m.GroupMember?.role === 'LEADER');
              const students = (group.members || []).filter((m) => m.role === 'STUDENT');
              return (
                <tr key={group.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ fontWeight: 600 }}>{group.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{group.course_name_code}</div>
                  </td>
                  <td>{currentLeader ? currentLeader.name : 'Not assigned'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select
                        className="input-field"
                        style={{ maxWidth: '260px' }}
                        defaultValue=""
                        onChange={(e) => assignLeader(group.id, e.target.value)}
                        disabled={assigning[group.id]}
                      >
                        <option value="" disabled>
                          {assigning[group.id] ? 'Assigning...' : 'Select student'}
                        </option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {groupsWithoutLeader.length > 0 ? (
        <div className="card" style={{ marginTop: '1.5rem', border: '1px solid #F59E0B', backgroundColor: '#FFFBEB' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#92400E' }}>
            Leader Assignment Required
          </h2>
          <p style={{ color: '#92400E', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Some groups currently have no leader. Please assign one immediately.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {groupsWithoutLeader.map((group) => {
              const eligibleStudents = (group.members || []).filter((m) => m.role === 'STUDENT');
              return (
                <div
                  key={group.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{group.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {group.course_name_code}
                    </div>
                  </div>
                  <select
                    className="input-field"
                    style={{ maxWidth: '260px' }}
                    defaultValue=""
                    onChange={(e) => assignLeader(group.id, e.target.value)}
                    disabled={assigning[group.id]}
                  >
                    <option value="" disabled>
                      {assigning[group.id] ? 'Assigning...' : 'Select student leader'}
                    </option>
                    {eligibleStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} color="var(--primary-color)" /> All Students By Course
        </h2>
        <div style={{ marginBottom: '1rem', maxWidth: '320px' }}>
          <select className="input-field" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 0' }}>Student Name</th>
              <th style={{ padding: '1rem 0' }}>Course</th>
              <th style={{ padding: '1rem 0' }}>Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>{student.name}</td>
                <td>{student.program_of_study || 'N/A'}</td>
                <td>{student.year_of_study || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary-color)" /> Student Join Feedback
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 0' }}>Student</th>
              <th style={{ padding: '1rem 0' }}>Course</th>
              <th style={{ padding: '1rem 0' }}>Joined Group</th>
              <th style={{ padding: '1rem 0' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {joinFeedback.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>{item.student?.name || 'Unknown'}</td>
                <td>{item.student?.program_of_study || 'N/A'}</td>
                <td>{item.group?.name || 'Unknown group'}</td>
                <td>{new Date(item.joinedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
