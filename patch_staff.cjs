const fs = require('fs');
let code = fs.readFileSync('src/components/StaffManager.tsx', 'utf8');

// Table Header - Serial Number
code = code.replace(
  '<th className="px-6 py-3">স্টাফ আইডি</th>',
  '<th className="px-6 py-3 w-16 text-center">ক্রমিক</th>\n                <th className="px-6 py-3">স্টাফ আইডি</th>'
);

// Map iteration - add index
code = code.replace(
  '{staff.map((s) => (',
  '{staff.map((s, idx) => ('
);

// Add td for serial number
code = code.replace(
  '<tr key={s.id} className="hover:bg-slate-50 transition-colors">\n                  <td className="px-6 py-3 font-medium text-slate-800">{s.id}</td>',
  '<tr key={s.id} className="hover:bg-slate-50 transition-colors">\n                  <td className="px-6 py-3 text-center text-slate-500">{idx + 1}</td>\n                  <td className="px-6 py-3 font-medium text-slate-800">{s.id}</td>'
);

// SubSection (ফিক্সড পোস্ট) Input
const searchNewSubSection = `<select 
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
              value={newStaff.subSection || ''}
              onChange={e => setNewStaff({...newStaff, subSection: e.target.value})}
            >
              <option value="">-- নির্বাচন করুন --</option>
              {posts.map(post => (
                <option key={post.id} value={post.name}>{post.name}</option>
              ))}
            </select>`;
            
const replaceNewSubSection = `<input 
              type="text"
              list="post-options"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
              placeholder="পোস্টের নাম লিখুন"
              value={newStaff.subSection || ''}
              onChange={e => setNewStaff({...newStaff, subSection: e.target.value})}
            />
            <datalist id="post-options">
              {posts.map(post => (
                <option key={post.id} value={post.name}>{post.name}</option>
              ))}
            </datalist>`;
code = code.replace(searchNewSubSection, replaceNewSubSection);

const searchEditSubSection = `<select 
                          className="w-full rounded-md border-slate-300 shadow-sm p-1 border text-sm bg-white"
                          value={editForm.subSection || ''}
                          onChange={e => setEditForm({...editForm, subSection: e.target.value})}
                        >
                          <option value="">--</option>
                          {posts.map(post => (
                            <option key={post.id} value={post.name}>{post.name}</option>
                          ))}
                        </select>`;
                        
const replaceEditSubSection = `<input 
                          type="text"
                          list="post-options-edit"
                          className="w-full rounded-md border-slate-300 shadow-sm p-1 border text-sm bg-white"
                          placeholder="পোস্টের নাম লিখুন"
                          value={editForm.subSection || ''}
                          onChange={e => setEditForm({...editForm, subSection: e.target.value})}
                        />
                        <datalist id="post-options-edit">
                          {posts.map(post => (
                            <option key={post.id} value={post.name}>{post.name}</option>
                          ))}
                        </datalist>`;
code = code.replace(searchEditSubSection, replaceEditSubSection);

fs.writeFileSync('src/components/StaffManager.tsx', code);
