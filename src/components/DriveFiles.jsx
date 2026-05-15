import React, { useState, useMemo } from 'react'
import { IconExternalLink, IconCircleCheck } from '@tabler/icons-react'
import { fileTypeIcon } from './utils'
import ImportModal from './ImportModal'

const DRIVE_FILES = [
  { name: 'NEW_HMI_Formats_v7.ods', id: '1ujP61H5uXLCoYD7-_D1-46DyeTmow6Am', type: 'ODS', size: '—', modified: '—' },
  { name: 'Git_Complete_Guide.docx', id: '1LgF6NQMg-46SBAifZCmACcUGkwjjzum9', type: 'DOCX', size: '—', modified: '—' },
  { name: 'STM32CubeIDE_Professional_Guide.docx', id: '1kdcNqM92G8R28ZbaJN-tyOnHSlgsjveF', type: 'DOCX', size: '—', modified: '—' },
  { name: 'SOP_Software_Documentation.docx', id: '1THA_s-FYa7TU-1ClbKQvnrKhxB0Ae19l', type: 'DOCX', size: '—', modified: '—' },
  { name: 'MotorCode_rev8_Documentation.docx', id: '1aoEvjtMcD9rYBaCe7QHx5LvKfGj_rgs1', type: 'DOCX', size: '—', modified: '—' },
  { name: 'LiftMotor_Flyer_v8_Documentation.docx', id: '1Fko_iXqPilWSxtAWaVbfuKY9qh76lRNf', type: 'DOCX', size: '—', modified: '—' },
  { name: 'MotorCode_Replacement_Debug.docx', id: '1yW9jxLLep4sJWWiQgix1kptbH-TiRxS1', type: 'DOCX', size: '—', modified: '—' },
  { name: 'MainBoard_Flyer01_v8_SoftwareDocumentation.docx', id: '15uZd5IQFuGaijhSG7aiQr3ifka9qiBow', type: 'DOCX', size: '—', modified: '—' },
  { name: 'SW_Documentation_Plan.docx', id: '1f1m6ISUNDoOacM-ZK70HxZu9hKuw6Ztm', type: 'DOCX', size: '—', modified: '—' },
  { name: 'AutoLeveller_Code_Function.docx', id: '1Y14RBzODr9g4SX5wl6k6KONwjVheNEFp', type: 'DOCX', size: '—', modified: '—' },
  { name: 'CAN Communication Plan_v8.xlsx', id: '1rEQ6km8N5pH9D_PsREPxehNPQRBpSCYD', type: 'XLSX', size: '—', modified: '—' },
  { name: 'Carding_MachineSettings.pdf', id: '1jFteo_jr-PNiZZl9GQvpXi4lmD5cBqUv', type: 'PDF', size: '—', modified: '—' },
]

export default function DriveFiles({ docs, categories, addToast, onView }) {
  const [importFile, setImportFile] = useState(null)

  const importedIds = useMemo(
    () => new Set(docs.filter((d) => d.driveFileId).map((d) => d.driveFileId)),
    [docs]
  )

  function driveViewUrl(id) {
    return `https://drive.google.com/file/d/${id}/view`
  }

  return (
    <div className="page drive-files">
      <div className="page-header">
        <h1 className="page-title">Google Drive Files</h1>
        <a
          href="https://drive.google.com/drive/folders/1WXVghTj-6GxPSnhhtZ3inNAebjIXBbVN"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          <IconExternalLink size={14} /> Open Folder
        </a>
      </div>

      <div className="table-wrap">
        <table className="doc-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {DRIVE_FILES.map((f) => {
              const imported = importedIds.has(f.id)
              const portalDoc = docs.find((d) => d.driveFileId === f.id)
              return (
                <tr key={f.id} className="doc-row">
                  <td className="doc-name-cell">
                    {fileTypeIcon(f.name)}
                    <span>{f.name}</span>
                    {imported && (
                      <IconCircleCheck size={16} color="var(--accent)" title="Imported to portal" style={{ marginLeft: 6 }} />
                    )}
                  </td>
                  <td>{f.type}</td>
                  <td className="actions-cell">
                    <a
                      href={driveViewUrl(f.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn"
                      title="Open in Drive"
                    >
                      <IconExternalLink size={16} />
                    </a>
                    {imported ? (
                      <button
                        className="btn btn-sm btn-accent"
                        onClick={() => portalDoc && onView(portalDoc)}
                        title="View in portal"
                      >
                        View
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setImportFile(f)}
                      >
                        Import
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {importFile && (
        <ImportModal
          file={importFile}
          categories={categories}
          onClose={() => setImportFile(null)}
          addToast={addToast}
        />
      )}
    </div>
  )
}
