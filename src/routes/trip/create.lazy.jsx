import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/AuthContext';
import postTrip from '@/api/trip/postTrip';
import getUsers from '@/api/user/getUsers';
import getSubordinates from '@/api/user/getSubordinates';
import { router } from '@/router';

export const Route = createLazyFileRoute('/trip/create')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subordinates, setSubordinates] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]); // To lookup names for Badges

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDialogMsg, setErrorDialogMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    participantIds: [],
  });
  const [selectValue, setSelectValue] = useState('');

  const handleSelectChange = (value) => {
    addParticipant(value);
    setSelectValue(value);
    setTimeout(() => setSelectValue(''), 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.tk) return;
      try {
        const [usersData, subordinatesData] = await Promise.all([
          getUsers(user.tk),
          getSubordinates(user.tk),
        ]);

        const subIds = new Set(subordinatesData.map((s) => s.id));
        const others = usersData.filter((u) => !subIds.has(u.id));

        setSubordinates(subordinatesData);
        setOtherUsers(others);
        setAllParticipants([...subordinatesData, ...others]);
      } catch (error) {
        router.navigate({
          to: '/error',
          replace: true,
          search: {
            status: error.status || 500,
            msg: error.message || 'An unexpected error occurred.',
          },
        });
      }
    };
    fetchData();
  }, [user?.tk]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addParticipant = (id) => {
    if (!formData.participantIds.includes(id)) {
      setFormData((prev) => ({ ...prev, participantIds: [...prev.participantIds, id] }));
    }
  };

  const removeParticipant = (id) => {
    setFormData((prev) => ({
      ...prev,
      participantIds: prev.participantIds.filter((pid) => pid !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.tk) {
      toast.error('You must be logged in to create a trip');
      return;
    }
    setLoading(true);

    // Convert dates to ISO string format as per requirement
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      await postTrip(payload, user.tk);
      toast.success('Trip created successfully');
      navigate({ to: '/trip' });
    } catch (error) {
      console.error(error);

      if (error.status === 400) {
        setErrorDialogMsg(error.message || 'The selected dates overlap with an existing trip.');
        setErrorDialogOpen(true);
      } else {
        toast.error(error.message || 'Failed to create trip');
      }
    } finally {
      setLoading(false);
    }
  };

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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a participant to add" />
                </SelectTrigger>
                <SelectContent>
                  {subordinates.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Subordinates</SelectLabel>
                      {subordinates
                        .filter((p) => !formData.participantIds.includes(p.id))
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex flex-col items-start text-left">
                              <span className="font-medium">{user.fullName}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}

                  {subordinates.length > 0 && otherUsers.length > 0 && <SelectSeparator />}

                  {otherUsers.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Other Users</SelectLabel>
                      {otherUsers
                        .filter((p) => !formData.participantIds.includes(p.id))
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex flex-col items-start text-left">
                              <span className="font-medium">{user.fullName}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}

                  {subordinates.length === 0 && otherUsers.length === 0 && (
                    <div className="p-2 text-sm text-center text-gray-500">No users found</div>
                  )}
                </SelectContent>
              </Select>

              <div className="flex flex-col gap-2 mt-2">
                {formData.participantIds.map((id) => {
                  const user = allParticipants.find((p) => p.id === id);
                  return user ? (
                    <div
                      key={id}
                      className="w-full flex justify-between items-center p-3 rounded-md border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900">{user.fullName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeParticipant(id)}
                        className="hover:bg-gray-100 rounded-full p-1 transition-colors text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/trip' })}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0f172a]" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Trip
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>Trip Schedule Conflict</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 py-2">{errorDialogMsg}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setErrorDialogOpen(false)}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Understood, I'll fix it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
