import React, { useRef } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// ── Icons (inline SVG to avoid extra deps) ──────────────────────────────────
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);

// ── Predefined group options ─────────────────────────────────────────────────
const GROUP_OPTIONS = [
  'Web 3',
  'React',
  'JavaScript',
  'CSS',
  'Data Structures',
  'Algorithms',
  'Python',
  'Machine Learning',
  'Other',
];

// ── Validation schema ────────────────────────────────────────────────────────
const validationSchema = Yup.object({
  group: Yup.string().required('Group is required'),
  description: Yup.string(),
  terms: Yup.array().of(
    Yup.object({
      term: Yup.string().required('Term is required'),
      definition: Yup.string().required('Definition is required'),
    })
  ).min(1, 'Add at least one term'),
});

const emptyTerm = { term: '', definition: '', image: null, imagePreview: null };

// ── Component ────────────────────────────────────────────────────────────────
function CreateFlashcard({ onFlashcardCreated }) {
  const termInputRefs = useRef({});

  const handleGroupImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFieldValue('groupImagePreview', reader.result);
      reader.readAsDataURL(file);
      setFieldValue('groupImage', file);
    }
  };

  const handleTermImageUpload = (e, index, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFieldValue(`terms[${index}].imagePreview`, reader.result);
      reader.readAsDataURL(file);
      setFieldValue(`terms[${index}].image`, file);
    }
  };

  const focusTermInput = (index) => {
    const ref = termInputRefs.current[index];
    if (ref) ref.focus();
  };

  const handleSubmit = (values, { resetForm }) => {
    const newCard = {
      id: Date.now(),
      group: values.group,
      description: values.description,
      groupImagePreview: values.groupImagePreview,
      terms: values.terms,
    };
    onFlashcardCreated(newCard);
    resetForm();
    alert(`Flashcard "${values.group}" created successfully!`);
  };

  return (
    <Formik
      initialValues={{
        group: '',
        description: '',
        groupImage: null,
        groupImagePreview: null,
        terms: [{ ...emptyTerm }],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          {/* ── Section 1: Group Info ── */}
          <div className="form-card">
            <label className="field-label">
              Create Group<span className="required">*</span>
            </label>
            <div className="input-row">
              <div className="select-wrapper">
                <Field as="select" name="group" className="form-select">
                  <option value="">Select a group</option>
                  {GROUP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Field>
                <span className="select-arrow">▼</span>
              </div>

              <label className="upload-btn">
                <UploadIcon />
                {values.groupImagePreview ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleGroupImageUpload(e, setFieldValue)}
                />
              </label>
            </div>

            <ErrorMessage name="group" component="p" className="field-error" />

            {values.groupImagePreview && (
              <img
                src={values.groupImagePreview}
                alt="Group"
                style={{ marginTop: 12, height: 80, borderRadius: 8, objectFit: 'cover' }}
              />
            )}

            <Field
              as="textarea"
              name="description"
              className="form-textarea"
              placeholder="Describe the roles, responsibility, skills required for the job and help candidate understand the role better."
            />
          </div>

          {/* ── Section 2: Terms ── */}
          <div className="form-card">
            <FieldArray name="terms">
              {({ push, remove }) => (
                <>
                  {values.terms.map((term, index) => (
                    <div key={index} className="term-row">
                      {/* Number badge */}
                      <div className="term-number">{index + 1}</div>

                      {/* Fields */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
                          {/* Term input */}
                          <div className="term-field">
                            <label className="field-label">
                              Enter Term<span className="required">*</span>
                            </label>
                            <Field
                              name={`terms[${index}].term`}
                              className="form-input"
                              placeholder=""
                              innerRef={(el) => (termInputRefs.current[index] = el)}
                            />
                            <ErrorMessage
                              name={`terms[${index}].term`}
                              component="p"
                              className="field-error"
                            />
                          </div>

                          {/* Definition input */}
                          <div className="term-field">
                            <label className="field-label">
                              Enter Definition<span className="required">*</span>
                            </label>
                            <Field
                              as="textarea"
                              name={`terms[${index}].definition`}
                              className="form-input"
                              style={{ resize: 'vertical', minHeight: 40 }}
                              placeholder=""
                            />
                            <ErrorMessage
                              name={`terms[${index}].definition`}
                              component="p"
                              className="field-error"
                            />
                          </div>
                        </div>

                        {/* Image area */}
                        <div className="term-image-area" style={{ marginTop: 8 }}>
                          {term.imagePreview ? (
                            <>
                              <img
                                src={term.imagePreview}
                                alt="term"
                                className="term-image-preview"
                              />
                              <div className="term-actions">
                                <button
                                  type="button"
                                  className="icon-btn delete"
                                  title="Remove image"
                                  onClick={() => {
                                    setFieldValue(`terms[${index}].image`, null);
                                    setFieldValue(`terms[${index}].imagePreview`, null);
                                  }}
                                >
                                  <TrashIcon />
                                </button>
                                <label className="icon-btn edit" title="Change image" style={{ cursor: 'pointer' }}>
                                  <EditIcon />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleTermImageUpload(e, index, setFieldValue)}
                                  />
                                </label>
                              </div>
                            </>
                          ) : (
                            <label className="select-image-btn">
                              Select Image
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleTermImageUpload(e, index, setFieldValue)}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Delete term button (only if more than 1 term) */}
                      {values.terms.length > 1 && (
                        <button
                          type="button"
                          className="icon-btn delete"
                          title="Delete this term"
                          onClick={() => remove(index)}
                          style={{ marginTop: 28 }}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-more-btn"
                    onClick={() => push({ ...emptyTerm })}
                  >
                    + Add more
                  </button>
                </>
              )}
            </FieldArray>
          </div>

          {/* ── Create Button ── */}
          <div className="create-btn-wrapper">
            <button type="submit" className="create-btn" disabled={isSubmitting}>
              Create
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateFlashcard;
