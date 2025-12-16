
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import userService from '@/services/userService'
import tripService from '@/services/tripService'

export const Route = createLazyFileRoute('/trip/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [participants, setParticipants] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    participantIds: []
  })
  const [selectValue, setSelectValue] = useState('')

  const handleSelectChange = (value) => {
    addParticipant(value)
    setSelectValue(value) 
    setTimeout(() => setSelectValue(''), 0)
  }

  useEffect(() => {
    userService.getAll().then(setParticipants).catch(console.error)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addParticipant = (id) => {
    if (!formData.participantIds.includes(id)) {
      setFormData(prev => ({ ...prev, participantIds: [...prev.participantIds, id] }))
    }
  }

  const removeParticipant = (id) => {
    setFormData(prev => ({ ...prev, participantIds: prev.participantIds.filter(pid => pid !== id) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Convert dates to ISO string format as per requirement
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    }

    try {
      await tripService.createTrip(payload)
      toast.success("Trip created successfully")
      navigate({ to: '/trip' })
    } catch (error) {
        console.error(error)
      toast.error("Failed to create trip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full p-6 min-h-screen bg-gray-50/50 flex justify-center">
      <Card className="w-full max-w-2xl border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Create New Trip</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Trip Title</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="e.g. Client Visit Japan" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input 
                id="destination" 
                name="destination" 
                placeholder="e.g. Tokyo, Japan" 
                value={formData.destination} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  name="endDate" 
                  type="date" 
                  value={formData.endDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Trip purpose and details..." 
                value={formData.description} 
                onChange={handleChange} 
                rows={3}
              />
            </div>


            <div className="space-y-2">
              <Label>Participants</Label>
              <Select value={selectValue} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a participant to add" />
                </SelectTrigger>
                <SelectContent>
                  {participants.filter(p => !formData.participantIds.includes(p.id)).map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                  {participants.filter(p => !formData.participantIds.includes(p.id)).length === 0 && (
                      <div className="p-2 text-sm text-gray-500 text-center">No more users to add</div>
                  )}
                </SelectContent>
              </Select>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.participantIds.map(id => {
                  const user = participants.find(p => p.id === id)
                  return user ? (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                      {user.name}
                      <button 
                        type="button" 
                        onClick={() => removeParticipant(id)}
                        className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </button>
                    </Badge>
                  ) : null
                })}
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-gray-100 pt-4">
             <Button type="button" variant="outline" onClick={() => navigate({ to: '/trip' })}>Cancel</Button>
             <Button type="submit" className="bg-[#0f172a]" disabled={loading}>
               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Create Trip
             </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
