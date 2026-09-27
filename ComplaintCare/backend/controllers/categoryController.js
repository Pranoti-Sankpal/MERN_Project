// ============================================================
// Complaint category management (Admin manages; all roles can read).
// ============================================================
const { pool } = require('../config/db');
const { success, error } = require('../utils/apiResponse');
const { isNonEmptyString } = require('../utils/validators');

// GET /api/categories  (any authenticated user)
async function getCategories(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM complaint_categories ORDER BY name ASC');
    return success(res, 200, 'Categories fetched successfully.', { categories: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/categories  (Admin only)
async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!isNonEmptyString(name, 100)) return error(res, 400, 'Category name is required.');

    const [existing] = await pool.query('SELECT id FROM complaint_categories WHERE name = ?', [name.trim()]);
    if (existing.length > 0) return error(res, 409, 'A category with this name already exists.');

    const [result] = await pool.query('INSERT INTO complaint_categories (name, description) VALUES (?, ?)', [
      name.trim(),
      description || null,
    ]);

    const [rows] = await pool.query('SELECT * FROM complaint_categories WHERE id = ?', [result.insertId]);
    return success(res, 201, 'Category created successfully.', { category: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/categories/:id  (Admin only)
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [existing] = await pool.query('SELECT id FROM complaint_categories WHERE id = ?', [id]);
    if (existing.length === 0) return error(res, 404, 'Category not found.');

    if (name !== undefined && !isNonEmptyString(name, 100)) {
      return error(res, 400, 'Category name cannot be empty.');
    }

    await pool.query('UPDATE complaint_categories SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?', [
      name ? name.trim() : null,
      description !== undefined ? description : null,
      id,
    ]);

    const [rows] = await pool.query('SELECT * FROM complaint_categories WHERE id = ?', [id]);
    return success(res, 200, 'Category updated successfully.', { category: rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/categories/:id  (Admin only)
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT id FROM complaint_categories WHERE id = ?', [id]);
    if (existing.length === 0) return error(res, 404, 'Category not found.');

    await pool.query('DELETE FROM complaint_categories WHERE id = ?', [id]);
    return success(res, 200, 'Category deleted successfully.');
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
