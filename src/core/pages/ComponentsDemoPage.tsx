import React from "react";
import {
  Button,
  Badge,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Divider,
  IconButton,
  Avatar,
  SearchInput,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  Loader,
  EmptyState,
  ErrorMessage,
  PageHeader,
  MainContainer,
  DatePicker,
} from "../components";
import { ROUTE_PATHS } from "../../routes/routes";

const ComponentsDemoPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  const selectOptions = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ];

  return (
    <MainContainer>
      <PageHeader
        title="Design System Demo"
        breadcrumbs={[
          { label: "Dashboard", href: ROUTE_PATHS.HOME },
          { label: "Component Demo" },
        ]}
      />
      <div className="container mx-auto px-5 py-8 space-y-8">

        {/* Buttons & Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons & Badges</CardTitle>
            <CardDescription>
              Variantes principales de botones y badges.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="light">Light</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge status="online">Online</Badge>
              <Badge status="offline">Offline</Badge>
              <Badge status="available">Available</Badge>
              <Badge status="vacation">Vacation</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Formularios */}
        <Card>
          <CardHeader>
            <CardTitle>Form Inputs</CardTitle>
            <CardDescription>
              Campos de formulario básicos del sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Input
              </label>
              <Input placeholder="Escribe algo" />
              <SearchInput placeholder="Buscar..." />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Textarea
              </label>
              <Textarea rows={3} placeholder="Descripción" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Select
              </label>
              <Select
                options={selectOptions}
                defaultValue={selectOptions[0]?.value}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                DatePicker
              </label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Selecciona una fecha"
              />
            </div>
          </CardContent>
        </Card>

        {/* Avatar & IconButton */}
        <Card>
          <CardHeader>
            <CardTitle>Avatar & IconButton</CardTitle>
            <CardDescription>Componentes de acción y usuario.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Avatar
                  src="https://api.dicebear.com/7.x/initials/svg?seed=JD"
                  alt="Dr. John Doe"
                  fallback="JD"
                />
                <span className="text-sm text-foreground">Avatar</span>
              </div>
              <Divider orientation="vertical" className="h-8" />
              <div className="flex items-center gap-3">
                <IconButton aria-label="Ejemplo">IB</IconButton>
                <span className="text-sm text-foreground">IconButton</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Tabla básica con cabecera y filas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>
                    <Badge status="online">Online</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>
                    <Badge status="offline">Offline</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              Componentes de estados vacíos, error y carga.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader size="md" />
              <span className="text-sm text-foreground">Loader</span>
            </div>
            <div>
              <EmptyState
                title="Sin datos"
                description="No se encontraron registros para mostrar."
              />
            </div>
            <div>
              <ErrorMessage message="Ha ocurrido un error inesperado." />
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        <Card>
          <CardHeader>
            <CardTitle>Modal</CardTitle>
            <CardDescription>Ejemplo de apertura de modal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>Abrir modal</Button>
            <Modal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Ejemplo de modal"
            >
              <p className="text-sm text-muted-foreground">
                Puedes utilizar este modal para confirmaciones, formularios u otra
                información importante.
              </p>
            </Modal>
          </CardContent>
        </Card>
      </div>
    </MainContainer>
  );
};

export default ComponentsDemoPage;
