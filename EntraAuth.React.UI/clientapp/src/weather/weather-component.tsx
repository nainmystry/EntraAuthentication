/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    useEffect,
    useMemo,
    useState
} from "react";
import type { WeatherForecast } from "../models/WeatherForecast";
import { weatherService } from "../services/WeatherService";
import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination, 
    TableSortLabel,   
    Typography
} from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import * as React from "react";


// 2. Sort Comparator (Reusable utility function)
const getComparator = <Key extends keyof WeatherForecast>(
    order: 'asc' | 'desc',
    orderBy: Key
): ((a: WeatherForecast, b: WeatherForecast) => number) => {
    return (a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

         // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return order === 'asc' ? 1 : -1;
        if (bValue == null) return order === 'asc' ? -1 : 1;

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    };
};


//mockData
const fetchWeatherData = async (): Promise<WeatherForecast[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data matching the interface
    return [
        {
            //id: 1,
            date: '2023-05-01',
            temperatureC: 25,
            temperatureF: 77,
            summary: 'Sunny'
        },
        {
            //id: 2,
            date: '2023-05-02',
            temperatureC: 18,
            temperatureF: 64,
            summary: 'Cloudy'
        },
        {
            //id: 3,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy'
        },
        {
           // id: 4,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy1'
        },
        {
            //id: 5,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy2'
        },
        {
            //id: 6,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy3'
        },
        {
            //id: 7,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy4'
        },
        {
            //id: 8,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy5'
        },
        {
            //id: 9,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy6'
        },
        {
            //id: 10,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy7'
        },
        {
            //id:11,
            date: '2023-05-03',
            temperatureC: 12,
            temperatureF: 54,
            summary: 'Rainy8'
        }
    ];
};


const WeatherForeCast: React.FC = () => {

    const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //material UI table data configs
    const [orderBy, setOrderBy] = useState<keyof WeatherForecast>('date');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


    useEffect(() => {
        const loadData = async () => {
            try {
                //const data = await weatherService.getForecasts();
                const result = await fetchWeatherData();
                const rowsWithIds = result.map((item, index) => ({
                    id: index + 1, // or generate a unique ID: `item.date.replace(/-/g, '')`
                    ...item
                }));
                setForecasts(rowsWithIds);
            } catch (e) {
                setError('Something went wrong');
                console.error(e);
            }
            finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // 3. Dynamically get column names from the first data item
    const columns = forecasts.length > 0
        ? Object.keys(forecasts[0]).map(key => ({
            id: key as keyof WeatherForecast,
            label: key.charAt(0).toUpperCase() + key.slice(1) // Capitalize first letter
        }))
        : [];

    // Memoized sorting and pagination //Explain useMemo.
    const sortedForecasts = useMemo(() => {
        return [...forecasts].sort(getComparator(order, orderBy));
    }, [forecasts, order, orderBy]);

    const _paginatedForecasts = useMemo(() => {
        return sortedForecasts.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );
    }, [sortedForecasts, page, rowsPerPage]);

    //// Event handlers
    const _handleSort = (property: keyof WeatherForecast) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const _handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const _handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    // Render states
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }
  if (error) return <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>;

    //if (loading) {
    //    return (
    //        <Box display="flex" justifyContent="center" p={4}>
    //            <CircularProgress />
    //        </Box>
    //    );
    //}
    //if (error) return <div>{error}</div>;

    const columnsUp: GridColDef[] = [       
        {
            field: 'id',
            headerName: 'Id',
            width: 90,
        },
        {
            field: 'date',
            headerName: 'Date',
            type: 'string',
            width: 90,
        },
        {
            field: 'temperatureC',
            headerName: 'Temp C',
            type: 'number',
            width: 90,
        },
        {
            field: 'temperatureF',
            headerName: 'Temp F',
            type: 'number',
            width: 90,
        },
        {
            field: 'summary',
            headerName: 'Summary',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${value} ${row.firstName || ''} ${row.lastName || ''}`,
        },
    ];
    const rows = forecasts;
    const paginationModel = { page: 0, pageSize: 5 };
    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columnsUp}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );

    //rendering using material UI grid
    //return (
    //   <Box sx={{ width: '100%', p: 3 }}>
    //       <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
    //         Weather Forecast
    //       </Typography>
    //    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto' }}>
    //        <Table aria-label="weather forecast table">
    //            <TableHead>
    //                <TableRow>
    //                    {[
    //                        { id: 'date', label: 'Date' },
    //                        { id: 'temperatureC', label: 'Temp (°C)', align: 'right' },
    //                        { id: 'temperatureF', label: 'Temp (°F)', align: 'right' },
    //                        { id: 'summary', label: 'Summary' }
    //                    ].map(column => (
    //                        <TableCell
    //                          key={column.id}
    //                          align={column.align as 'right' | 'left' | undefined}
    //                        >
    //                          <TableSortLabel
    //                            active={orderBy === column.id}
    //                            direction={orderBy === column.id ? order : 'asc'}
    //                            onClick={() => _handleSort(column.id as keyof WeatherForecast)}
    //                          >
    //                            {column.label}
    //                          </TableSortLabel>
    //                        </TableCell>
    //                    ))}
    //                </TableRow>
    //            </TableHead>
    //            <TableBody>
    //                {_paginatedForecasts.map((forecast) => (
    //                    <TableRow key={forecast.date} hover>
    //                        <TableCell>{new Date(forecast.date).toLocaleDateString()}</TableCell>
    //                        <TableCell align="right">{forecast.temperatureC}</TableCell>
    //                        <TableCell align="right">{forecast.temperatureF}</TableCell>
    //                        <TableCell>{forecast.summary ?? 'N/A'}</TableCell>
    //                    </TableRow>
    //                    ))}
    //            </TableBody>
    //        </Table>
    //    </TableContainer>

    //      <TablePagination
    //     rowsPerPageOptions={[5, 10, 25]}
    //     component="div"
    //     count={forecasts.length}
    //     rowsPerPage={rowsPerPage}
    //     page={page}
    //     onPageChange={_handleChangePage}
    //     onRowsPerPageChange={_handleChangeRowsPerPage}
    //   />
    // </Box>
    //);

    //rendering using material UI grid

    //return (
       
    //        <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto' }}>
    //            <Table aria-label="weather forecast table">
    //                <TableHead>
    //                <TableRow>
    //                    {columns.map(column => (
    //                            <TableCell key={column.id}>{column.label}</TableCell>    
    //                        ))}
    //                    </TableRow>
    //                </TableHead>
    //                <TableBody>
    //                    {forecasts.map((row, index) => (
    //                    <TableRow key={index}>
    //                        {columns.map(column => (
    //                            <TableCell key={`${index}-${column.id}`}>
    //                                {String(row[column.id])}
    //                            </TableCell>
    //                        ))}
    //                    </TableRow>
    //                ))}                       
    //                </TableBody>
    //            </Table>
    //        </TableContainer>
    //);

    //render using table.
    //return (
    //    <div>
    //        <h2>Weather Forecast</h2>
    //        <table>
    //            <thead>
    //                <tr>
    //                    <th>Date</th>
    //                    <th>�C</th>
    //                    <th>�F</th>
    //                    <th>Summary</th>
    //                </tr>
    //            </thead>
    //            <tbody>
    //                {forecasts.map((forecast, index) => (
    //                    <tr key={index}>
    //                        <td>{forecast.date}</td>
    //                        <td>{forecast.temperatureC}</td>
    //                        <td>{forecast.temperatureF}</td>
    //                        <td>{forecast.summary || 'N/A'}</td>
    //                    </tr>
    //                ))}
    //            </tbody>
    //        </table>
    //    </div>
    //);
};
export default WeatherForeCast;



    /*
    I want to secure my react frontend with Azure open ID msal.
    I have below Folder Structure in my react app. How to implement it. So that when the app is started it directly asks for login first. Follow best practices.
    src
    |- auth
        |- authConfig.ts
        |- AuthProvider.tsx
        |- LoginRedirect.tsx
    |
    |- models
    |
    |- services
        |- WeatherService.ts
    |
    |- shared
        |- api
            |- axiosConfig.ts (internally adds interceptorsw for auth & error)
    |
    |- weather-forecast-components
    |
    |- App.tsx
    |
    |- main.tsx

    */