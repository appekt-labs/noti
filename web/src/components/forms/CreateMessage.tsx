import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import { useCreateMessage } from '../../hooks/useMessages'
import { useProjects } from '../../hooks/useProjects'
import { FiX, FiChevronDown } from 'react-icons/fi'
import 'react-datepicker/dist/react-datepicker.css'

interface CreateMessageProps {
  onClose: () => void
  projectId?: string
}

const validationSchema = Yup.object({
  projectId: Yup.string().uuid('Invalid project ID').required('Project is required'),
  title: Yup.string()
    .max(30, 'Title must be less than 30 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(100, 'Description must be less than 100 characters')
    .required('Description is required'),
  type: Yup.string()
    .oneOf(['banner', 'modal', 'toast'], 'Invalid type')
    .required('Type is required'),
  variant: Yup.string()
    .oneOf(['info', 'warning', 'danger', 'success'], 'Invalid variant')
    .required('Variant is required'),
  activeFrom: Yup.date().required('Start date is required'),
  activeTo: Yup.date()
    .required('End date is required')
    .min(Yup.ref('activeFrom'), 'End date must be after start date'),
})

function CreateMessage({ onClose, projectId }: CreateMessageProps) {
  const createMessage = useCreateMessage()
  const { data: projects } = useProjects()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <Formik
          initialValues={{
            projectId: projectId || '',
            title: '',
            description: '',
            type: 'banner' as const,
            variant: 'info' as const,
            activeFrom: new Date(),
            activeTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            await createMessage.mutateAsync({
              ...values,
              activeFrom: values.activeFrom.toISOString(),
              activeTo: values.activeTo.toISOString(),
            })
            resetForm()
            onClose()
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <Listbox
                  value={values.projectId}
                  onChange={(value) => setFieldValue('projectId', value)}
                  disabled={!!projectId}
                >
                  <div className="relative">
                    <ListboxButton
                      id="projectId"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-left flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <span className={values.projectId ? 'text-gray-900' : 'text-gray-500'}>
                        {values.projectId
                          ? projects?.find((p) => p.id === values.projectId)?.name || 'Select a project'
                          : 'Select a project'}
                      </span>
                      <FiChevronDown className="w-5 h-5 text-gray-400" />
                    </ListboxButton>
                    <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
                      <ListboxOption
                        value=""
                        className="px-4 py-2 cursor-pointer hover:bg-emerald-50 text-gray-700 ui-selected:bg-emerald-100 ui-selected:text-emerald-900"
                      >
                        Select a project
                      </ListboxOption>
                      {projects?.map((project) => (
                        <ListboxOption
                          key={project.id}
                          value={project.id}
                          className="px-4 py-2 cursor-pointer hover:bg-emerald-50 text-gray-700 ui-selected:bg-emerald-100 ui-selected:text-emerald-900"
                        >
                          {project.name}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
                <ErrorMessage name="projectId" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-gray-500 text-xs">(max 30 chars)</span>
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  maxLength={30}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Enter message title"
                />
                <div className="flex justify-between mt-1">
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                  <span className="text-xs text-gray-500">{values.title.length}/30</span>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-gray-500 text-xs">(max 100 chars)</span>
                </label>
                <Field
                  id="description"
                  name="description"
                  as="textarea"
                  rows={3}
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                  placeholder="Enter message description"
                />
                <div className="flex justify-between mt-1">
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                  <span className="text-xs text-gray-500">{values.description.length}/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <Field
                    id="type"
                    name="type"
                    as="select"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="banner">Banner</option>
                    <option value="modal">Modal</option>
                    <option value="toast">Toast</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-2">
                    Variant
                  </label>
                  <Field
                    id="variant"
                    name="variant"
                    as="select"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Danger</option>
                    <option value="success">Success</option>
                  </Field>
                  <ErrorMessage name="variant" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active From
                  </label>
                  <DatePicker
                    selected={values.activeFrom}
                    onChange={(date) => setFieldValue('activeFrom', date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                  <ErrorMessage name="activeFrom" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active To
                  </label>
                  <DatePicker
                    selected={values.activeTo}
                    onChange={(date) => setFieldValue('activeTo', date)}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={values.activeFrom}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                  <ErrorMessage name="activeTo" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Message'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default CreateMessage
